# Spec 008 — Moderación / cierre comunitario

**Producto:** Ayuda en Emergencias  
**Feature:** `008-moderacion`  
**Fase:** 9  
**Estado:** APROBADA (pivote 2026-08-14)  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. **Sin moderador humano obligatorio.** El público no ve panel de admin.  
2. Quien publica un aviso/lugar/mascota recibe un **enlace secreto de cierre** (sin registro).  
3. Con ese enlace puede marcar: ya no se necesita / lugar cerrado / mascota apareció.  
4. El ítem desaparece de listados públicos.  
5. API de moderación con token queda **solo para ops de emergencia** (sin UI ciudadana).

## 2. Alcance

### IN

- `manageToken` al crear need / pet / place comunitario (hash en DB).  
- `GET /manage/preview` + `POST /manage/close`.  
- UI `/cerrar?kind=&id=&token=`.  
- Mostrar enlace al publicar (buscar, perdidos, publicar-punto).  
- Quitar `/moderacion` del producto ciudadano (redirect home).

### OUT

- App admin con roles/SSO.  
- “Cualquiera puede cerrar el aviso de otro” sin token.  
- Moderación de eventos oficiales.  
- Deploy (Fase 10).

## 3. Criterios

- [x] Crear → token una vez → enlace `/cerrar`.  
- [x] Cerrar con token → fuera de listados.  
- [x] Sin vista de moderación en nav ni URL útil al ciudadano.  
- [x] Fase 9 lista → siguiente Fase 10.
