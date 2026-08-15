# Plan 005 — Densificación territorial

**Spec:** APROBADA · Constitution: PASS (integrar OSM/SISPRO; no inventar; rate-limit Overpass)

1. `osm-help.connector`: query con `out center`, más tags, límite razonable.  
2. `connector-runner`: pausa entre ciudades OSM.  
3. `city-bboxes`: añadir anclas faltantes (p. ej. Sincelejo, Riohacha…).  
4. `places.service`: order by distance si hay lat/lng/radius.  
5. Frontend api + `/ayudar` geolocation.  
6. ROADMAP / QUE-ES / AGENTS / README.
