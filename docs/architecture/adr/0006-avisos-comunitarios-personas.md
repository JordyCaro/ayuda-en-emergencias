# ADR 0006 — Avisos comunitarios de personas (además del RND)

**Fecha:** 2026-08-18  
**Estado:** Aceptada  
**Decisor:** product owner (chat)

## Contexto

La constitution pedía derivar desaparecidos solo a RND/SIRDEC, sin base propia. El product owner pide **mantener esos canales oficiales** y, además, un muro comunitario como el de mascotas (busco / se vio / encontré, foto opcional, 7 días).

## Decisión

1. RND, SIRDEC y 123/141/155 siguen **visibles** en `/perdidos` → Personas (fichas fijas a los lados en escritorio; compactas en celular).  
2. El muro comunitario es como mascotas: avisos `UNVERIFIED` (`LOOKING` | `SEEN` | `FOUND`), con WhatsApp y foto opcionales, caducidad 7 días y borrado.  
3. Copy: no somos autoridad; hay que reportar también por el canal oficial; sin cédulas ni datos de menores.  
4. No scrapear SIRDEC ni presentarnos como registro oficial.

## Consecuencias

- Hay una tabla `person_reports` (señales, no fichas oficiales).  
- Moderación puede ocultar abuso.  
- Constitution VIII se aclara para permitir estas señales con controles.
