import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ModerationAction,
  ModerationAuditDto,
  ModerationQueueItem,
  ModerationTargetKind,
} from '@aee/shared-types';
import { PlaceEntity } from '../places/place.entity';
import { NeedEntity } from '../needs/need.entity';
import { PetReportEntity } from '../pets/pet-report.entity';
import { PersonReportEntity } from '../people/person-report.entity';
import { ModerationAuditEntity } from './moderation-audit.entity';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(PlaceEntity)
    private readonly places: Repository<PlaceEntity>,
    @InjectRepository(NeedEntity)
    private readonly needs: Repository<NeedEntity>,
    @InjectRepository(PetReportEntity)
    private readonly pets: Repository<PetReportEntity>,
    @InjectRepository(PersonReportEntity)
    private readonly people: Repository<PersonReportEntity>,
    @InjectRepository(ModerationAuditEntity)
    private readonly audits: Repository<ModerationAuditEntity>,
  ) {}

  async queue(kind?: ModerationTargetKind): Promise<ModerationQueueItem[]> {
    const items: ModerationQueueItem[] = [];
    const take = 80;

    if (!kind || kind === 'place') {
      const rows = await this.places
        .createQueryBuilder('p')
        .where('p.verification = :v', { v: 'UNVERIFIED' })
        .andWhere('p.status = :s', { s: 'ACTIVE' })
        .andWhere('LOWER(p.source_id) IN (:...ids)', {
          ids: ['community', 'user'],
        })
        .orderBy('p.created_at', 'DESC')
        .take(take)
        .getMany();
      for (const p of rows) {
        items.push({
          kind: 'place',
          id: p.id,
          title: p.title,
          detail: p.type,
          municipality: p.municipality,
          cityCode: p.cityCode,
          verification: p.verification,
          status: p.status,
          createdAt: p.createdAt.toISOString(),
        });
      }
    }

    if (!kind || kind === 'need') {
      const rows = await this.needs.find({
        where: { verification: 'UNVERIFIED', status: 'OPEN' },
        order: { createdAt: 'DESC' },
        take,
      });
      for (const n of rows) {
        items.push({
          kind: 'need',
          id: n.id,
          title: n.description.slice(0, 120),
          detail: `${n.intent} · ${n.category}`,
          municipality: n.municipality,
          cityCode: n.cityCode,
          verification: n.verification,
          status: n.status,
          createdAt: n.createdAt.toISOString(),
        });
      }
    }

    if (!kind || kind === 'pet') {
      const rows = await this.pets.find({
        where: { verification: 'UNVERIFIED', status: 'OPEN' },
        order: { createdAt: 'DESC' },
        take,
      });
      for (const p of rows) {
        items.push({
          kind: 'pet',
          id: p.id,
          title: p.description.slice(0, 120),
          detail: `${p.kind} · ${p.species}`,
          municipality: p.municipality,
          cityCode: p.cityCode,
          verification: p.verification,
          status: p.status,
          createdAt: p.createdAt.toISOString(),
        });
      }
    }

    if (!kind || kind === 'person') {
      const rows = await this.people.find({
        where: { verification: 'UNVERIFIED', status: 'OPEN' },
        order: { createdAt: 'DESC' },
        take,
      });
      for (const p of rows) {
        items.push({
          kind: 'person',
          id: p.id,
          title: p.description.slice(0, 120),
          detail: p.kind,
          municipality: p.municipality,
          cityCode: p.cityCode,
          verification: p.verification,
          status: p.status,
          createdAt: p.createdAt.toISOString(),
        });
      }
    }

    items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return items.slice(0, 120);
  }

  async verify(
    kind: ModerationTargetKind,
    id: string,
    note?: string,
  ): Promise<ModerationQueueItem> {
    return this.apply(kind, id, 'VERIFY', note);
  }

  async hide(
    kind: ModerationTargetKind,
    id: string,
    note?: string,
  ): Promise<ModerationQueueItem> {
    return this.apply(kind, id, 'HIDE', note);
  }

  async recentAudits(limit = 40): Promise<ModerationAuditDto[]> {
    const rows = await this.audits.find({
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
    });
    return rows.map((r) => ({
      id: r.id,
      targetKind: r.targetKind,
      targetId: r.targetId,
      action: r.action,
      actor: r.actor,
      note: r.note,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  private async apply(
    kind: ModerationTargetKind,
    id: string,
    action: ModerationAction,
    note?: string,
  ): Promise<ModerationQueueItem> {
    let item: ModerationQueueItem;

    if (kind === 'place') {
      const p = await this.places.findOne({ where: { id } });
      if (!p) throw new NotFoundException(`Place ${id} not found`);
      if (action === 'VERIFY') {
        p.verification = 'VERIFIED';
      } else {
        p.verification = 'REJECTED';
        p.status = 'HIDDEN';
      }
      await this.places.save(p);
      item = {
        kind: 'place',
        id: p.id,
        title: p.title,
        detail: p.type,
        municipality: p.municipality,
        cityCode: p.cityCode,
        verification: p.verification,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      };
    } else if (kind === 'need') {
      const n = await this.needs.findOne({ where: { id } });
      if (!n) throw new NotFoundException(`Need ${id} not found`);
      if (action === 'VERIFY') {
        n.verification = 'VERIFIED';
      } else {
        n.verification = 'REJECTED';
        n.status = 'CLOSED';
      }
      await this.needs.save(n);
      item = {
        kind: 'need',
        id: n.id,
        title: n.description.slice(0, 120),
        detail: `${n.intent} · ${n.category}`,
        municipality: n.municipality,
        cityCode: n.cityCode,
        verification: n.verification,
        status: n.status,
        createdAt: n.createdAt.toISOString(),
      };
    } else if (kind === 'pet') {
      const p = await this.pets.findOne({ where: { id } });
      if (!p) throw new NotFoundException(`Pet ${id} not found`);
      if (action === 'VERIFY') {
        p.verification = 'VERIFIED';
      } else {
        p.verification = 'REJECTED';
        p.status = 'CLOSED';
      }
      await this.pets.save(p);
      item = {
        kind: 'pet',
        id: p.id,
        title: p.description.slice(0, 120),
        detail: `${p.kind} · ${p.species}`,
        municipality: p.municipality,
        cityCode: p.cityCode,
        verification: p.verification,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      };
    } else {
      const p = await this.people.findOne({ where: { id } });
      if (!p) throw new NotFoundException(`Person ${id} not found`);
      if (action === 'VERIFY') {
        p.verification = 'VERIFIED';
      } else {
        p.verification = 'REJECTED';
        p.status = 'CLOSED';
      }
      await this.people.save(p);
      item = {
        kind: 'person',
        id: p.id,
        title: p.description.slice(0, 120),
        detail: p.kind,
        municipality: p.municipality,
        cityCode: p.cityCode,
        verification: p.verification,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      };
    }

    await this.audits.save(
      this.audits.create({
        targetKind: kind,
        targetId: id,
        action,
        actor: 'moderator',
        note: note?.trim() || null,
      }),
    );

    return item;
  }
}
