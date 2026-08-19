# PRD — Growndona

**Versión:** 1.1
**Estado:** Núcleo del MVP implementado
**Última actualización:** 18/08/2026
**Plataforma:** Aplicación web responsive (mobile-first) + PWA
**Stack:** Next.js (App Router) + React + TypeScript + Supabase (Auth, PostgreSQL, Storage)
**Enfoque inicial:** MVP funcional
**IA:** Fuera del alcance
**Pagos:** Aún no implementados (la landing ya comunica pago único)

---

## Estado del producto

El PRD original (v1.0) definió el producto. Desde entonces se construyó la primera versión de Growndona: autenticación, cultivos, registros diarios, timeline, gráficos, galería, problemas, perfil e historial. El modelo también creció respecto al documento inicial: hay plantas individuales, parámetros por genética, usuario con username, landing pública y manifiesto PWA.

El cierre de la v1.0 decía que el próximo paso era bajar esto a arquitectura, modelo de datos y pantallas. **Eso ya está hecho.** El siguiente trabajo es cerrar huecos del PRD original, alinear la landing con lo que realmente se cobra, y recién después abrir la segunda etapa.

### Ya implementado (núcleo del MVP)

* Registro, inicio de sesión, cierre de sesión y recuperación de contraseña (Supabase Auth). Login también por username.
* Perfil: nombre, avatar, username, fecha de registro y estadísticas (cultivos activos/finalizados, registros, fotos, días cultivados).
* Crear, editar y finalizar cultivos (con nota final y gramos de cosecha / peso final).
* Períodos del cultivo (germinación, plántula, crecimiento, floración, secado, finalizado y personalizado) con duración calculada.
* Contador automático de día del cultivo y día del período.
* Registro diario con campos opcionales: parámetros, riego, acciones, fotos y notas.
* Parámetros: temperatura, humedad, pH, EC en µS/cm (rango 0–10000) y PPM. En cultivos con varias genéticas se registran y grafican por genética.
* Fotos en registros diarios y en problemas, almacenadas en Supabase Storage (bucket privado, signed URLs).
* Galería del cultivo ordenada por día.
* Riegos (desde el formulario diario y como acción rápida).
* Podas y acciones: poda, defoliación, trasplante, entrenamiento, cambio de solución, limpieza, otra.
* Problemas con estado activo/resuelto, descripción, solución, fechas y fotos.
* Timeline del cultivo y pantalla de historial reciente entre todos los cultivos.
* Dashboard de inicio con cultivo activo, últimos parámetros, actividad y acciones rápidas.
* Listado de cultivos activos y finalizados.
* Gráficos de parámetros (pH, EC, PPM, temperatura, humedad) con selector por genética cuando aplica.
* Vista individual del cultivo con secciones: Resumen, Timeline, Parámetros, Galería, Problemas, Información.
* Navegación mobile (BottomNav + TopNav de marca) y sidebar en desktop.
* Landing pública (funciones, cómo funciona, precio de pago único USD 42, CTA a registro).
* PWA básica (manifest + botón de instalación en login).

### Agregado respecto al PRD original

Estas piezas no estaban en el alcance v1.0 y ya existen en el producto:

| Cambio | Qué implica |
| --- | --- |
| Plantas individuales | Cada cultivo tiene filas en `plants` (número, genética, método, ambiente, medio, descripción), no solo un `plant_count`. |
| Parámetros por genética | `cultivation_genetics` + varias mediciones por día (`measurements.genetic_id`). |
| Username | Perfil y login por usuario; unique e indexado. |
| Gramos al finalizar | `harvest_grams` y `final_grams` en el cultivo. |
| EC en µS/cm | Escala 0–10000, no 0–20 mS/cm. El formulario diario muestra los 5 parámetros en una fila compacta. |
| Landing + precio | Página de marketing con pago único; **el cobro todavía no está cableado**. |
| PWA | Instalable desde el navegador; falta pulir iconos/tema. |

### Todavía no implementado (del PRD original)

* Vista calendario del cultivo (sección 23).
* Fotos asociadas a una acción concreta (hoy las fotos viven en el registro diario, no en `actions`).
* Hora editable del riego (el schema tiene `performed_at`; la UI usa el momento actual).
* Pestaña o listado dedicado de riegos (el acceso es por timeline / registro diario).
* Pagos, prueba con vencimiento y control de acceso de por vida (la landing los anuncia).
* Funciones sociales, comparación entre cultivos, recordatorios, nutrientes y riego avanzado (segunda etapa).

### Próximos pasos

Orden sugerido para no reabrir el alcance de golpe:

1. **Cerrar huecos del PRD original que todavía aportan al diario de cultivo**
   * Vista calendario del cultivo: días con actividad y acceso al registro al tocar un día.
   * Hora opcional en riegos, si se quiere cumplir el dato mínimo del PRD.
   * Fotos opcionales por acción, o confirmar que las fotos del día alcanzan y sacar ese requisito.
2. **Alinear monetización con la landing**
   * Decidir si el MVP se lanza gratis, con prueba abierta, o con pago único.
   * Si se cobra: implementar checkout, marcar acceso de por vida y dejar de redirigir el CTA de “prueba gratuita” a un registro sin límite.
   * Si no se cobra todavía: bajar o ocultar el bloque de precio hasta que exista el flujo.
3. **Pulido PWA y mobile**
   * Iconos del manifest en tamaños correctos, `theme_color` alineado a la marca, y comportamiento standalone estable.
4. **Segunda etapa (después de validar el núcleo)**
   * Registro avanzado de riegos (cantidad, pH/EC del agua, nutrientes).
   * Recordatorios.
   * Comparación entre cultivos y entre fotos del mismo día de ciclo.
   * Exportación del cultivo.
   * Privacidad (privado / amigos / público) y funciones sociales.
   * Seguimiento diario por planta (hoy las plantas existen, pero el registro diario es por cultivo/genética).

IA, sensores, IoT, marketplace y gamificación siguen **fuera de alcance**.

---

## 1. Descripción del producto

**Growndona** será una aplicación web orientada al seguimiento y registro de cultivos.

La aplicación permitirá que cada usuario cree uno o varios cultivos y mantenga un historial organizado de lo que sucede durante todo el ciclo de las plantas.

El objetivo principal es reemplazar anotaciones dispersas, fotos sueltas y registros manuales por un único lugar donde consultar:

* Etapa actual del cultivo.
* Días transcurridos.
* Parámetros ambientales.
* Parámetros de cultivo.
* Riegos realizados.
* Podas y otras acciones.
* Problemas encontrados.
* Fotografías.
* Notas.
* Historial completo.

El concepto principal será:

> **Cada cultivo tendrá una línea de tiempo formada por registros diarios y eventos.**

---

# 2. Problema

Actualmente una persona puede llevar el seguimiento de un cultivo utilizando diferentes métodos:

* Notas del celular.
* Fotografías de la galería.
* Planillas.
* WhatsApp.
* Recordatorios.
* Memoria personal.

Esto genera información fragmentada y hace difícil responder preguntas como:

* ¿Cuándo realicé el último riego?
* ¿Qué pH tenía hace una semana?
* ¿Cuándo comenzó floración?
* ¿Cuánto duró crecimiento?
* ¿Cuándo apareció determinado problema?
* ¿Qué hice para solucionarlo?
* ¿Cómo se veía la planta en determinado momento?
* ¿Cuántos días lleva el cultivo?

Growndona busca centralizar toda esa información.

---

# 3. Objetivo principal

Permitir que una persona pueda registrar y consultar fácilmente **todo el historial de un cultivo desde su inicio hasta su finalización**.

La aplicación debe priorizar tres cosas:

**Rapidez para registrar información.**

**Facilidad para entender el estado actual del cultivo.**

**Facilidad para consultar lo ocurrido anteriormente.**

---

# 4. Usuarios

## Usuario registrado

Cada usuario tendrá su propia cuenta y podrá:

* Crear cultivos.
* Editar sus cultivos.
* Finalizar cultivos.
* Registrar información diaria.
* Subir fotografías.
* Registrar riegos.
* Registrar podas.
* Registrar problemas.
* Consultar históricos.
* Consultar estadísticas básicas.

Cada usuario solamente podrá modificar sus propios cultivos.

---

# 5. Estructura principal

La estructura general es:

```text
Usuario
 └── Cultivos
      ├── Plantas
      ├── Genéticas del cultivo
      ├── Períodos
      ├── Registros diarios
      │    ├── Parámetros (generales o por genética)
      │    ├── Fotos
      │    ├── Riegos
      │    ├── Acciones
      │    └── Notas
      │
      └── Problemas
           └── Fotos
```

Un usuario puede tener varios cultivos.

Cada cultivo tiene su propio historial independiente.

**Estado:** esta estructura ya está modelada en Supabase y usada por la app. El seguimiento diario sigue siendo por cultivo (y por genética cuando hay más de una), no por planta individual.

---

# 6. Cultivos

El usuario podrá crear un nuevo cultivo.

## Datos iniciales

Como mínimo:

* Nombre del cultivo.
* Fecha de inicio.
* Cantidad de plantas (se materializa en filas de `plants`).

Opcionalmente, a nivel cultivo o por planta:

* Variedad/genética.
* Método de cultivo.
* Tipo de sustrato o medio.
* Cultivo interior/exterior.
* Descripción.
* Foto principal.

Al crear o editar un cultivo el usuario puede indicar si las plantas comparten genética, método, ambos, o son independientes.

Ejemplo:

```text
Nombre: Cultivo Orbiter #1
Inicio: 11/08/2026
Cantidad de plantas: 4
Método: RDWC
```

---

# 7. Estado del cultivo

Un cultivo podrá encontrarse en:

* Activo.
* Finalizado.

Al finalizar un cultivo se solicitará:

* Fecha de finalización.
* Nota final opcional.
* Gramos de cosecha / peso final (opcional).

Los cultivos finalizados siguen disponibles para consulta.

No deberán desaparecer del historial.

---

# 8. Períodos del cultivo

Growndona permitirá dividir el cultivo en diferentes períodos.

Inicialmente:

* Germinación.
* Plántula.
* Crecimiento / Vegetativo.
* Floración.
* Secado.
* Finalizado.

El usuario indica cuándo comienza un nuevo período. También existe el tipo **personalizado**.

**Estado:** implementado, con cálculo automático de duración por etapa.

Ejemplo:

```text
11 agosto
Inicio del cultivo

18 agosto
Inicio de crecimiento

10 septiembre
Inicio de floración
```

Growndona calculará automáticamente cuánto tiempo estuvo la planta en cada etapa.

---

# 9. Día actual del cultivo

La aplicación calculará automáticamente:

> **Día X del cultivo**

utilizando la fecha de inicio.

Ejemplo:

```text
Cultivo iniciado:
01/08/2026

Fecha actual:
24/08/2026

Día 24
```

También podrá mostrar:

```text
Día 24 del cultivo
Día 12 de crecimiento
```

---

# 10. Registro diario

Esta será una de las funcionalidades principales de Growndona.

Cada día el usuario podrá crear una entrada dentro del cultivo.

Una entrada podrá contener diferentes tipos de información sin que todos sean obligatorios.

Por ejemplo, un día el usuario puede cargar solamente una foto y otro día parámetros, riego y notas.

---

# 11. Parámetros diarios

Dentro de una entrada se podrán registrar:

* Temperatura (°C).
* Humedad (%).
* pH.
* EC (µS/cm, 0–10000).
* PPM.

Ejemplo:

```text
Temperatura: 24 °C
Humedad: 61 %
pH: 5.9
EC: 534 µS/cm
PPM: 620
```

Los campos son opcionales.

No es necesario completar todos los parámetros para guardar una entrada.

Si el cultivo tiene más de una genética, el formulario permite cargar un set de parámetros por genética.

**Estado:** implementado, con fila compacta de inputs en el registro diario.

---

# 12. Fotografías

Cada registro diario podrá tener una o varias fotografías.

Las fotos quedarán vinculadas a:

* Usuario.
* Cultivo.
* Fecha.
* Día del cultivo.
* Período correspondiente.

Ejemplo:

```text
Cultivo Orbiter

Día 24
Crecimiento

Foto 1
Foto 2
Foto 3
```

Las imágenes se almacenan en **Supabase Storage** (bucket privado `cultivation-photos`, URLs firmadas).

**Estado:** implementado para registros diarios, problemas, portada del cultivo y avatar. Pendiente: fotos ligadas a una acción específica.

---

# 13. Galería del cultivo

Cada cultivo tendrá una galería donde puedan verse todas las imágenes registradas.

Se podrán ordenar cronológicamente.

Ejemplo:

```text
Día 1
[foto]

Día 5
[foto]

Día 10
[foto]

Día 15
[foto]
```

Esto permite visualizar fácilmente la evolución de las plantas.

**Estado:** implementado como pestaña Galería del cultivo.

---

# 14. Riegos

El usuario podrá registrar que realizó un riego.

Como información mínima:

* Fecha.
* Hora opcional.
* Nota opcional.

En versiones posteriores podría ampliarse con:

* Cantidad de agua.
* pH del agua.
* EC.
* Nutrientes utilizados.

Para el MVP no es necesario hacer complejo este registro.

**Estado:** el riego del día se registra (formulario diario y acción rápida). La hora no es editable en la UI. Cantidad, pH del agua, EC y nutrientes siguen fuera del MVP.

---

# 15. Podas y acciones

El usuario podrá marcar acciones realizadas durante el cultivo.

Acciones iniciales:

* Poda.
* Defoliación.
* Trasplante.
* Entrenamiento.
* Cambio de solución.
* Limpieza.
* Otra.

Cada acción tendrá:

* Tipo.
* Fecha.
* Nota opcional.
* Fotografías opcionales (pendiente: hoy las fotos son del registro diario, no de la acción).

Ejemplo:

```text
Día 24

Poda realizada

Nota:
Se eliminaron ramas inferiores.
```

---

# 16. Notas

El usuario podrá agregar texto libre a cualquier registro diario.

Ejemplo:

```text
Las plantas crecieron bastante desde ayer.
Una de las plantas presenta hojas más claras.
```

Las notas servirán para registrar información que no corresponda a ningún campo específico.

---

# 17. Registro de problemas

Growndona permitirá registrar problemas encontrados durante el cultivo.

Cada problema tendrá:

* Título.
* Fecha de detección.
* Descripción.
* Fotografías.
* Estado.
* Solución aplicada opcional.
* Fecha de resolución opcional.

Estados:

* Activo.
* Resuelto.

Ejemplo:

```text
Problema:
Hojas amarillas

Detectado:
Día 31

Descripción:
Las hojas inferiores comenzaron a amarillear.

Acción realizada:
Cambio de solución.

Estado:
Resuelto
```

---

# 18. Historial / Timeline

Cada cultivo tendrá una línea de tiempo cronológica.

Será uno de los principales sistemas de navegación.

Ejemplo:

### Día 24

`Crecimiento`

**Parámetros**

* 24 °C
* 61% humedad
* pH 5.9
* EC 1.2
* 620 PPM

**Eventos**

✓ Riego
✓ Poda

📷 3 fotos

**Nota**

> Se realizó poda y se acomodaron las ramas.

---

### Día 25

`Crecimiento`

✓ Riego

📷 1 foto

---

### Día 26

`Crecimiento`

Problema detectado:

> Hojas amarillas.

De esta forma el usuario podrá reconstruir prácticamente todo el ciclo.

---

# 19. Dashboard principal

Al ingresar a Growndona el usuario verá principalmente su cultivo activo.

El dashboard deberá responder rápidamente:

> ¿Cómo está mi cultivo actualmente?

Podría mostrar:

### Cultivo actual

**Orbiter #1**

```text
Día 37
Crecimiento
```

### Últimos parámetros

```text
Temperatura     24 °C
Humedad         58 %
pH              6.1
EC              1.15
PPM             590
```

### Actividad

```text
Último registro    Hoy
Último riego       Ayer
Última poda        Hace 6 días
```

### Problemas

```text
1 problema activo
```

### Acciones rápidas

* Registrar día.
* Registrar riego.
* Agregar fotos.
* Registrar problema.

El dashboard debe ser visual y fácil de leer, evitando convertirlo en una pantalla llena de texto.

**Estado:** implementado, con selector si hay más de un cultivo activo y gráficos de parámetros.

---

# 20. Mis cultivos

Existirá una pantalla para consultar todos los cultivos del usuario.

Separados entre:

### Activos

```text
Orbiter #1
Día 37
Crecimiento
```

### Finalizados

```text
Cultivo #03
92 días

Cultivo #02
81 días
```

Cada cultivo tendrá acceso a su historial completo.

---

# 21. Vista individual del cultivo

Al entrar a un cultivo se mostrarán principalmente:

* Nombre.
* Foto.
* Día actual.
* Período actual.
* Fecha de inicio.
* Cantidad de plantas.
* Últimos parámetros.
* Último riego.
* Problemas activos.

Y accesos a:

* Timeline.
* Parámetros.
* Galería.
* Problemas.
* Información del cultivo (plantas, datos del cultivo, finalizar/eliminar).

Los riegos no tienen pestaña propia: aparecen en el registro diario, las acciones rápidas y el timeline.

**Estado:** implementado con navegación por secciones en la ficha del cultivo.

---

# 22. Gráficos

Los parámetros registrados podrán convertirse automáticamente en gráficos.

Inicialmente:

### pH

Evolución del pH a través del tiempo.

### EC

Evolución de EC.

### PPM

Evolución de PPM.

### Temperatura

Evolución de temperatura.

### Humedad

Evolución de humedad.

Por ejemplo:

```text
Día
1 ───── 10 ───── 20 ───── 30

pH
5.8 → 5.9 → 6.1 → 5.8
```

Esto permitirá detectar tendencias sin revisar manualmente todos los registros.

---

# 23. Calendario

El cultivo podrá visualizarse también mediante calendario.

Los días que tengan actividad estarán identificados.

Por ejemplo:

```text
11   📷
12   💧
13   📷 💧
14   ✂️
15   ⚠️
```

Al seleccionar un día se abrirá su registro.

**Estado:** no implementado. El DatePicker existe para formularios, pero no hay vista calendario del cultivo. Es el hueco más visible del PRD original dentro del diario de cultivo.

---

# 24. Perfil

Cada usuario contará con un perfil.

Información inicial:

* Nombre.
* Foto/avatar.
* Fecha de registro.

También podrá mostrar estadísticas como:

* Cultivos activos.
* Cultivos finalizados.
* Total de registros.
* Total de fotos.
* Días cultivados.

**Estado:** implementado, incluyendo username y edición de nombre/avatar.

---

# 25. Navegación

Para el MVP propongo una navegación sencilla.

### Inicio

Dashboard.

### Mis cultivos

Listado de cultivos.

### Registrar

Acción rápida para añadir información.

### Historial

Actividad reciente.

### Perfil

Información y configuración del usuario.

En mobile, **Registrar** funciona como acción principal destacada (BottomNav). Encima hay una barra de marca (TopNav) solo en mobile.

**Estado:** implementado. Rutas: `/dashboard`, `/cultivos`, `/registrar`, `/historial`, `/perfil`.

---

# 26. Flujo principal

El flujo más importante debe ser extremadamente corto.

### Crear cultivo

```text
Nuevo cultivo

↓

Datos básicos

↓

Crear

↓

Dashboard del cultivo
```

### Registrar información

```text
Cultivo

↓

Registrar

↓

¿Qué querés registrar?

Parámetros
Fotos
Riego
Acción
Problema
Nota

↓

Guardar
```

El objetivo debería ser poder guardar un registro normal en pocos segundos.

---

# 27. Autenticación

Supabase Auth manejará:

* Registro.
* Inicio de sesión.
* Cierre de sesión.
* Recuperación de contraseña.

Cada usuario tiene acceso exclusivamente a sus propios datos privados (RLS en todas las tablas).

**Estado:** implementado, incluyendo confirmación de email y recuperación de contraseña.

---

# 28. Base de datos

Entidades actuales (migrations `0001`–`0007`):

```text
profiles
cultivations
plants
cultivation_genetics
cultivation_periods
daily_entries
measurements          (una fila por genética por día; genetic_id nullable)
actions
irrigations
photos                (del registro diario)
problems
problem_photos
```

Relación general:

```text
profiles
   ↓
cultivations
   ├── plants
   ├── cultivation_genetics
   ├── cultivation_periods
   ├── problems → problem_photos
   ↓
daily_entries
   ├── measurements → cultivation_genetics
   ├── actions
   ├── irrigations
   └── photos
```

Storage: bucket privado `cultivation-photos`.

Los días del cultivo (`Día X`) se calculan a partir de `start_date`; no se persisten.

---

# 29. Responsive

Growndona deberá desarrollarse pensando principalmente en uso desde celular.

Esto es importante porque la mayoría de los registros probablemente se realizarán cerca del cultivo.

Por lo tanto:

* Botones grandes.
* Formularios cortos.
* Inputs numéricos fáciles de usar.
* Cámara/galería accesibles rápidamente.
* Navegación sencilla.
* Acciones principales al alcance del pulgar.

Desktop tendrá una versión más amplia del mismo sistema.

---

# 30. MVP

Para evitar hacer una aplicación enorme desde el comienzo, el **MVP de Growndona** incluye:

| # | Funcionalidad | Estado |
| --- | --- | --- |
| 1 | Registro e inicio de sesión | Hecho |
| 2 | Perfil básico | Hecho |
| 3 | Crear cultivo | Hecho |
| 4 | Editar cultivo | Hecho |
| 5 | Finalizar cultivo | Hecho |
| 6 | Períodos del cultivo | Hecho |
| 7 | Contador de días | Hecho |
| 8 | Registro diario | Hecho |
| 9 | Temperatura | Hecho |
| 10 | Humedad | Hecho |
| 11 | pH | Hecho |
| 12 | EC (µS/cm) | Hecho |
| 13 | PPM | Hecho |
| 14 | Fotos | Hecho |
| 15 | Notas | Hecho |
| 16 | Riegos | Hecho (mínimo) |
| 17 | Podas/acciones | Hecho (sin foto propia) |
| 18 | Registro de problemas | Hecho |
| 19 | Timeline | Hecho |
| 20 | Galería | Hecho |
| 21 | Dashboard del cultivo | Hecho |
| 22 | Listado de cultivos activos/finalizados | Hecho |
| 23 | Gráficos básicos de parámetros | Hecho |

Con esto **el núcleo del producto ya es funcional**. El calendario del cultivo (sección 23) no estaba en esta lista y sigue pendiente.

---

# 31. Fuera del MVP

No deberíamos meter estas funcionalidades ahora:

* Inteligencia artificial.
* Chatbot.
* Reconocimiento de problemas mediante fotografías.
* Marketplace.
* Suscripciones / Plan Pro (la landing actual habla de **pago único**, no de suscripción).
* Pagos (flujo todavía no construido).
* Integraciones con sensores.
* Automatización de dispositivos.
* Controladores IoT.
* Chat entre usuarios.
* Sistema complejo de notificaciones.
* Gamificación.

Agregar todo eso ahora sería un error porque aumentaría muchísimo el alcance antes de validar que el núcleo de Growndona realmente funciona.

---

# 32. Funcionalidades sociales

La idea social puede mantenerse dentro del producto, pero **la dejaría para una segunda etapa**.

Podría incluir:

* Perfil público.
* Seguir usuarios.
* Amigos.
* Cultivos públicos.
* Cultivos privados.
* Álbumes públicos.
* Likes.
* Comentarios.
* Explorar cultivos.

La privacidad de un cultivo podría ser:

```text
Privado
Solo amigos
Público
```

Esto puede convertir Growndona posteriormente en algo más cercano a:

> **Diario de cultivo + comunidad de cultivadores**

pero no debería distraernos del MVP.

---

# 33. Segunda etapa

Después de cerrar los huecos del MVP y definir monetización:

* Comparación entre cultivos.
* Comparación de fotografías.
* Estadísticas históricas.
* Calendario (primero el del PRD original; luego uno avanzado).
* Recordatorios.
* Más tipos de acciones.
* Nutrientes.
* Registro avanzado de riegos.
* Seguimiento diario individual por planta (las plantas ya existen como entidad).
* Timelapse.
* Exportación del cultivo.
* Perfiles públicos.
* Amigos/seguidores.
* Feed.
* Cultivos públicos.

---

# 34. Posible comparación entre cultivos

A futuro:

```text
                    Cultivo A      Cultivo B

Duración             81 días        93 días
Crecimiento           30 días        35 días
Floración             51 días        58 días
pH promedio             5.9            6.1
EC promedio             1.3            1.5
Riegos                   24             31
Problemas                 2              4
```

También se podrían comparar fotografías tomadas en el mismo día del ciclo.

---

# 35. Principios de UX

Growndona deberá seguir algunas reglas claras.

### Registrar debe ser rápido

No debemos obligar al usuario a llenar un formulario enorme todos los días.

Todos los campos posibles deben ser opcionales salvo donde realmente sea necesario.

### Mostrar primero lo importante

El usuario debería abrir la aplicación y saber inmediatamente:

* Día del cultivo.
* Período.
* Últimos parámetros.
* Último riego.
* Problemas activos.

### Evitar duplicación

Una poda registrada hoy no debería necesitar cargarse nuevamente en otra sección.

Debe existir un único dato que después pueda aparecer en diferentes vistas.

### Historial siempre accesible

La aplicación deberá hacer fácil volver atrás y consultar qué ocurrió determinada fecha.

---

# 36. Ejemplo completo

Supongamos que hoy el usuario abre Growndona.

Ve:

## Orbiter #1

**Día 37 · Crecimiento**

```text
Temperatura        24 °C
Humedad            58 %
pH                 6.1
EC                 1.2
PPM                610
```

**Último riego**

Ayer

**Problemas activos**

1

Luego toca:

### + Registrar

Selecciona:

* Parámetros.
* Riego.
* Fotos.

Carga:

```text
Temperatura: 25
Humedad: 55
pH: 5.9
EC: 1.3
PPM: 640

✓ Realicé riego
📷📷
```

Presiona:

**Guardar registro**

Automáticamente Growndona agrega:

```text
Día 37
11/08/2026

Parámetros registrados
Riego realizado
2 fotografías
```

al timeline.

Ese debería ser **el corazón de todo el producto**.

---

# 37. Criterio de éxito del MVP

Podemos considerar que Growndona cumple su objetivo inicial si un usuario puede:

> Crear un cultivo, registrar regularmente lo que sucede, consultar cómo está actualmente y meses después reconstruir fácilmente todo lo que ocurrió durante ese ciclo.

No necesitamos más para validar la idea.

---

# 38. Resumen funcional

La primera versión de **Growndona** será principalmente:

> **Un diario digital inteligente y visual para registrar todo el ciclo de un cultivo.**

El núcleo estará compuesto por:

**Cultivos → períodos → días → parámetros + acciones + riegos + problemas + fotos + notas.**

Sobre esa estructura después podremos construir gráficos, estadísticas, comparaciones y funciones sociales sin tener que rediseñar conceptualmente la aplicación.

La arquitectura de pantallas, el modelo de Supabase y las funcionalidades por página **ya existen**. El próximo trabajo concreto está en **Estado del producto → Próximos pasos**: calendario, decisión de pagos vs landing, pulido PWA, y recién después la segunda etapa.
