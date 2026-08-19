# PRD — Growndona

**Versión:** 1.2

**Estado:** Núcleo del MVP implementado

**Última actualización:** 19/08/2026

**Plataforma:** Aplicación web responsive (mobile-first) + PWA

**Stack:** Next.js (App Router) + React + TypeScript + Supabase (Auth, PostgreSQL, Storage)

**Enfoque actual:** Núcleo funcional + diferenciación de producto, UX y preparación de lanzamiento

**IA:** Fuera del alcance

**Pagos:** Aún no implementados. Modelo definido como pago único; rango objetivo de lanzamiento: USD 4,20–14,20.

---

## Estado del producto

El PRD original (v1.0) definió el producto y la v1.1 documentó el primer núcleo ya construido. La v1.2 **no reinicia Growndona ni reemplaza lo hecho**: toma el producto actual como base y define la siguiente dirección a partir del aprendizaje competitivo y de producto.

Growndona ya cuenta con autenticación, cultivos, plantas, genéticas, registros diarios, timeline, gráficos, galería, problemas, perfil, historial, landing pública y PWA básica. A partir de ahora el foco deja de ser simplemente “agregar funcionalidades” y pasa a ser **hacer que registrar y consultar un cultivo sea extraordinariamente simple, agradable y rápido**.

La referencia competitiva principal es Grow with Jane, pero Growndona **no buscará igualar su cantidad de funciones, comunidad o capa social**. La diferenciación será:

- experiencia mucho más simple;
- registro rápido;
- parámetros organizados por genética cuando corresponda;
- modo Simple y modo Avanzado;
- excelente timeline y evolución visual;
- estadísticas claras;
- exportación final del cultivo;
- identidad argentina y cercanía con el usuario;
- precio accesible de pago único;
- producto privado por defecto, sin convertirlo en una red social.

### Ya implementado (núcleo del MVP)

- Registro, inicio de sesión, cierre de sesión y recuperación de contraseña (Supabase Auth). Login también por username.
- Perfil: nombre, avatar, username, fecha de registro y estadísticas.
- Crear, editar y finalizar cultivos, con nota final y gramos de cosecha / peso final.
- Períodos del cultivo: germinación, plántula, crecimiento, floración, secado, finalizado y personalizado.
- Contador automático de día del cultivo y día del período.
- Registro diario con campos opcionales: parámetros, riego, acciones, fotos y notas.
- Parámetros actuales: temperatura, humedad, pH, EC en µS/cm y PPM.
- Parámetros por genética cuando el cultivo contiene más de una genética.
- Fotos en registros diarios y problemas mediante Supabase Storage privado + signed URLs.
- Galería cronológica del cultivo.
- Riegos desde formulario diario y acción rápida.
- Acciones: poda, defoliación, trasplante, entrenamiento, cambio de solución, limpieza y otra.
- Problemas con estado activo/resuelto, descripción, solución, fechas y fotos.
- Timeline por cultivo e historial reciente general.
- Dashboard con cultivo activo, últimos parámetros, actividad y acciones rápidas.
- Cultivos activos y finalizados.
- Gráficos de pH, EC, PPM, temperatura y humedad con selector por genética.
- Vista individual: Resumen, Timeline, Parámetros, Galería, Problemas e Información.
- BottomNav + TopNav mobile y sidebar desktop.
- Landing pública.
- PWA básica.

### Agregado respecto al PRD original y ya existente

| Cambio | Qué implica |
| --- | --- |
| Plantas individuales | Cada cultivo tiene filas en `plants`; no depende solo de `plant_count`. |
| Parámetros por genética | `cultivation_genetics` + mediciones separadas por genética mediante `measurements.genetic_id`. |
| Username | Perfil y login por usuario; unique e indexado. |
| Gramos al finalizar | `harvest_grams` y `final_grams`. |
| EC en µS/cm | Escala 0–10000. |
| Landing pública | Ya existe una página de marketing; debe ampliarse y actualizar precio/posicionamiento. |
| PWA | Instalable desde navegador; falta pulir experiencia standalone, iconos y tema. |

### Nuevas decisiones de producto — v1.2

Estas decisiones **todavía no deben marcarse como implementadas salvo donde se indique**:

1. **Modo Simple / Avanzado para registrar parámetros.**
   - Simple mantiene la experiencia actual y muestra solo lo esencial.
   - Avanzado habilitará parámetros y opciones adicionales sin sobrecargar al usuario común.
   - El usuario podrá alternar entre ambos de forma evidente y sin perder datos.

2. **La UX pasa a ser una prioridad de producto, no solo estética.**
   - Transiciones suaves.
   - Microinteracciones.
   - Feedback visual inmediato.
   - Formularios rápidos.
   - Menos pantallas y pasos innecesarios.
   - Animaciones funcionales y agradables, nunca decorativas al punto de ralentizar el flujo.

3. **Growndona se posicionará primero para Argentina y luego LATAM.**
   - Español natural y cercano.
   - Identidad argentina reconocible sin recurrir constantemente a banderas, clichés o referencias forzadas.
   - Sensación de producto hecho por gente que entiende al cultivador local.

4. **No se perseguirá una estrategia de red social en esta etapa.**
   - Perfiles públicos, seguidores, feed, likes y comentarios dejan de ser prioridad.
   - El cultivo será privado por defecto.
   - El foco seguirá siendo la herramienta personal de seguimiento.

5. **Precio objetivo revisado.**
   - Se descarta el precio de USD 42 comunicado por la landing actual.
   - Growndona se plantea como **pago único**.
   - Rango objetivo inicial: **USD 4,20 a USD 14,20**.
   - El valor exacto se definirá antes del checkout según alcance de lanzamiento y validación.

6. **La landing deberá crecer.**
   - Ya no será únicamente una presentación breve + precio.
   - Deberá explicar problema, propuesta, experiencia Simple/Avanzado, registro por genética, timeline, estadísticas, fotos, privacidad, pago único y diferenciación.

7. **Exportación del cultivo sube de prioridad.**
   - Informe final descargable con resumen, estadísticas, etapas, acciones, fotos y resultados.
   - PDF visual y compartible como objetivo de segunda etapa temprana.

8. **Evolución fotográfica y comparación ganan prioridad.**
   - Galería actual se mantiene.
   - Futuro: comparaciones por día de ciclo y selección de hitos visuales.

### Todavía no implementado

- Vista calendario.
- Hora editable de riegos.
- Fotos asociadas a una acción concreta.
- Modo Avanzado.
- Parámetros avanzados.
- Exportación PDF/informe final.
- Comparación de cultivos y fotografías.
- Recordatorios.
- Checkout y acceso lifetime.
- Compresión de imágenes del lado del cliente y cuota formal de almacenamiento.
- Pulido completo de animaciones, microinteracciones y transiciones.
- Expansión de la landing según la nueva estrategia.

### Próximos pasos

Orden recomendado:

1. **Pulir el corazón del producto**
   - Mantener intacto lo ya funcional.
   - Revisar registro diario, navegación y dashboard buscando eliminar fricción.
   - Implementar transiciones y feedback visual coherentes.
   - Revisar especialmente la experiencia mobile.

2. **Crear Modo Simple / Avanzado**
   - Simple = parámetros actuales.
   - Avanzado = campos adicionales, todos opcionales.
   - Implementarlo mediante progressive disclosure, sin duplicar formularios o lógica.

3. **Cerrar huecos útiles del PRD original**
   - Calendario.
   - Hora opcional de riego.
   - Definir si las fotos por acción aportan valor real antes de implementarlas.

4. **Mejorar lectura y análisis**
   - Estadísticas claras.
   - Comparación de genéticas.
   - Resumen de cultivo.
   - Mejor galería.
   - Informe/exportación.

5. **Actualizar y expandir landing**
   - Eliminar USD 42.
   - Comunicar pago único dentro del rango USD 4,20–14,20 cuando se defina precio final.
   - Mostrar producto real, beneficios y diferenciadores.
   - Mantener CTA de prueba si todavía no existe checkout.

6. **Preparar monetización**
   - Checkout.
   - Estado de acceso lifetime.
   - Reglas de prueba.
   - Política de almacenamiento de fotos.

7. **Validar con usuarios reales**
   - Priorizar retención y frecuencia de registros por encima de cantidad de cuentas creadas.

IA, sensores, IoT, marketplace, gamificación y red social completa siguen **fuera del foco del producto**.

---

## 1. Descripción del producto

**Growndona** es una aplicación web/PWA mobile-first orientada al seguimiento privado y organizado de cultivos.

Permite crear uno o varios cultivos y registrar todo su ciclo desde el inicio hasta la finalización. La propuesta no es convertirse en una plataforma social ni competir por cantidad de funciones: debe ser **la forma más rápida, clara y agradable de llevar un cultivo al día**.

El usuario podrá consultar:

- etapa y día actual;
- genéticas y plantas;
- parámetros;
- riegos;
- acciones;
- problemas;
- fotografías;
- notas;
- gráficos;
- timeline;
- resultados finales.

El concepto principal sigue siendo:

> **Cada cultivo tendrá una línea de tiempo formada por registros diarios y eventos.**

La evolución de v1.2 agrega un segundo principio:

> **La complejidad debe aparecer solo cuando el usuario la necesita.**

Por eso el registro tendrá un modo Simple y uno Avanzado.

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

La aplicación debe priorizar:

1. **Rapidez para registrar información.**
2. **Facilidad para entender el estado actual.**
3. **Facilidad para reconstruir lo ocurrido anteriormente.**
4. **Simplicidad para quien solo quiere registrar lo esencial.**
5. **Profundidad opcional para quien necesita datos avanzados.**
6. **Una experiencia mobile suave, agradable y predecible.**
7. **Cercanía cultural y lingüística con el usuario argentino.**

El objetivo no es ofrecer la mayor cantidad posible de herramientas, sino que las herramientas elegidas funcionen extremadamente bien.

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

El registro de parámetros tendrá **dos modos alternables**.

## 11.1 Modo Simple

Es el modo principal y debe preservar la rapidez del formulario actual.

Campos:

- Temperatura (°C).
- Humedad (%).
- pH.
- EC (µS/cm, 0–10000).
- PPM.

Todos los campos son opcionales.

Ejemplo:

```text
Temperatura: 24 °C
Humedad: 61 %
pH: 5.9
EC: 534 µS/cm
PPM: 620
```

Si el cultivo tiene más de una genética, se carga un set por genética.

**Estado:** implementado funcionalmente; la denominación formal “Modo Simple” y el selector Simple/Avanzado todavía no existen.

## 11.2 Modo Avanzado

El usuario podrá alternar a **Avanzado** desde el mismo flujo de registro.

No debe abrir una experiencia independiente ni obligar al usuario a completar más información. Será una expansión progresiva del formulario.

Además de los parámetros del modo Simple, podrá contemplar progresivamente:

- VPD.
- CO₂.
- PPFD.
- Temperatura del agua / solución.
- Cantidad de agua.
- pH del agua o solución.
- EC del agua o solución.
- Nutrientes/fertilización asociados.
- Observaciones técnicas adicionales.

La lista exacta se validará antes de implementar para no agregar campos sin utilidad real.

### Reglas UX

- Recordar la última preferencia Simple/Avanzado del usuario.
- Permitir cambiar de modo en cualquier momento.
- No borrar valores al alternar.
- Campos avanzados siempre opcionales.
- Si un valor avanzado no fue usado nunca, no debe contaminar gráficos ni resúmenes.
- Mobile: evitar una pantalla excesivamente larga mediante grupos plegables o secciones progresivas.

**Estado:** pendiente.

---

# 12. Fotografías

Cada registro diario podrá tener una o varias fotografías.

Las fotos quedarán vinculadas a:

- Usuario.
- Cultivo.
- Fecha.
- Día del cultivo.
- Período correspondiente.

Las imágenes se almacenan en **Supabase Storage** mediante bucket privado y URLs firmadas.

## Estrategia de almacenamiento

Para evitar costos innecesarios y mantener la aplicación rápida:

- no almacenar de forma predeterminada la imagen original de varios megapíxeles;
- comprimir/redimensionar del lado del cliente antes de subir;
- preferir WebP u otro formato eficiente compatible;
- mantener calidad suficiente para observar la evolución del cultivo;
- cargar thumbnails/preview en timelines y abrir la versión mayor bajo demanda;
- definir una cuota razonable antes del lanzamiento pago.

Como referencia de producto, se evaluará una cuota suficientemente amplia para uso real sin prometer almacenamiento ilimitado de por vida.

**Estado:** subida y consulta de imágenes implementadas. Optimización automática/cuotas pendientes. Fotos ligadas a una acción concreta siguen pendientes.

---

# 13. Galería del cultivo

Cada cultivo tendrá una galería cronológica con todas las imágenes registradas.

**Estado actual:** implementado.

La evolución de esta sección deberá permitir entender visualmente el progreso, no solo almacenar fotos.

Mejoras previstas:

- agrupar por día del cultivo;
- identificar etapa/período;
- selección rápida de hitos;
- comparación de fotografías del mismo día de ciclo entre cultivos;
- comparación “antes/después”;
- posible generación futura de timelapse.

Ejemplo:

```text
Día 1     [foto]
Día 15    [foto]
Día 30    [foto]
Día 45    [foto]
Cosecha   [foto]
```

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

Los parámetros registrados se convierten automáticamente en gráficos.

Actualmente:

- pH.
- EC.
- PPM.
- Temperatura.
- Humedad.

Cuando existen múltiples genéticas, los datos pueden filtrarse por genética.

**Estado:** implementado para parámetros actuales.

La siguiente evolución debe priorizar claridad antes que cantidad:

- selector de período/rango temporal;
- promedio, mínimo y máximo cuando tenga sentido;
- comparación entre genéticas;
- indicación visual de cambios de etapa;
- incorporación de parámetros del modo Avanzado solo cuando existan datos;
- resúmenes fáciles de interpretar sin obligar al usuario a leer cada registro.

Los gráficos avanzados no deben convertir el dashboard en una consola técnica.

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
Modo Simple | Avanzado
↓
Parámetros / Fotos / Riego / Acción / Problema / Nota
↓
Guardar
↓
Feedback inmediato
```

El modo **Simple** debe resolver la gran mayoría de los registros cotidianos.

El modo **Avanzado** amplía el mismo formulario sin romper el flujo.

Objetivo UX: que un registro habitual pueda completarse en pocos segundos y con la menor cantidad razonable de taps.

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

# 29. Responsive, PWA y sensación de uso

Growndona se diseña principalmente para celular porque gran parte de los registros se realizará cerca del cultivo.

Por lo tanto:

- botones grandes;
- inputs numéricos cómodos;
- cámara/galería accesibles rápidamente;
- acciones principales al alcance del pulgar;
- BottomNav simple;
- formularios con progressive disclosure;
- evitar modales o pantallas innecesarias;
- estados de carga claros;
- funcionamiento PWA estable.

## Movimiento y microinteracciones

La experiencia debe sentirse **smooth**, pero el movimiento debe ayudar al usuario.

Se incorporarán progresivamente:

- transiciones suaves entre vistas;
- expansión/contracción animada de secciones;
- feedback al guardar;
- estados pressed/selected;
- skeletons o loaders coherentes;
- cambios de modo Simple/Avanzado fluidos;
- animaciones breves para altas, confirmaciones y cambios de estado;
- respeto por `prefers-reduced-motion`.

Evitar:

- animaciones largas;
- efectos que retrasen una acción;
- movimiento constante;
- transiciones diferentes sin un sistema común.

Desktop tendrá una versión más amplia del mismo producto, sin crear una UX conceptualmente distinta.

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

## Iteración posterior al MVP funcional

El núcleo listado arriba **ya funciona**. La v1.2 no reabre esa definición; establece la capa de diferenciación siguiente:

| Funcionalidad | Estado |
| --- | --- |
| Modo Simple formal | Base funcional existente; falta UX/selector |
| Modo Avanzado | Pendiente |
| Parámetros avanzados | Pendiente |
| Pulido de animaciones/microinteracciones | Pendiente |
| Calendario | Pendiente |
| Resumen estadístico de cultivo | Pendiente |
| Exportación / informe PDF | Pendiente |
| Comparaciones | Pendiente |
| Optimización automática de imágenes | Pendiente |
| Checkout lifetime | Pendiente |
| Landing v2 ampliada | Pendiente |


---

# 31. Fuera del MVP y fuera del foco actual

No debemos ampliar Growndona hacia funcionalidades que diluyan su propuesta antes de validar el núcleo.

Quedan fuera del foco actual:

- Inteligencia artificial.
- Chatbot.
- Diagnóstico automático mediante fotografías.
- Marketplace.
- Suscripción obligatoria / Plan Pro recurrente.
- Sensores e IoT.
- Automatización de dispositivos.
- Controladores.
- Chat entre usuarios.
- Feed social.
- Likes/comentarios/seguidores.
- Gamificación compleja.

**Pagos** no están implementados todavía, pero ya no se consideran una idea fuera de alcance: forman parte de la preparación de lanzamiento mediante un modelo de **pago único**.

Agregar funciones únicamente porque un competidor las tiene sería un error. Cada incorporación debe mejorar una de estas cuatro cosas: registro, lectura del estado, reconstrucción histórica o utilidad del historial.

---

# 32. Funcionalidades sociales

La estrategia cambia respecto de v1.1.

Growndona **no buscará convertirse en una red social de cultivadores en la segunda etapa**.

Por lo tanto dejan de ser prioridad:

- perfil público;
- seguidores;
- amigos;
- feed;
- likes;
- comentarios;
- exploración social de cultivos.

Los cultivos deben permanecer **privados por defecto**.

A futuro podría evaluarse una función puntual de compartir un informe, una imagen o un cultivo mediante enlace, pero compartir contenido no implica construir una red social completa.

Esta decisión permite concentrar producto y desarrollo en aquello que diferencia a Growndona: **seguimiento simple, profundidad opcional, historial y cercanía con el usuario**.

---

# 33. Segunda etapa

Después de cerrar el núcleo y pulir UX:

### Prioridad alta

- Modo Avanzado.
- Parámetros avanzados validados.
- Calendario.
- Estadísticas y resumen del cultivo.
- Exportación / informe PDF.
- Mejoras de galería y evolución fotográfica.
- Comparación entre genéticas.
- Optimización automática de fotos.
- Checkout y acceso lifetime.
- Landing v2.

### Prioridad media

- Comparación entre cultivos.
- Comparación de fotos del mismo día de ciclo.
- Recordatorios.
- Nutrientes.
- Registro avanzado de riegos.
- Más tipos de acciones.
- Timelapse.
- Historial por genética entre cultivos anteriores.

### Evaluar solo con evidencia de uso

- Seguimiento diario por planta individual.
- Compartir cultivos mediante enlace.
- Integraciones externas.

### No priorizar

- Red social.
- IA.
- Marketplace.
- IoT.
- Gamificación.

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

Growndona debe competir principalmente mediante experiencia de uso.

### Registrar debe ser rápido

No obligar al usuario a completar formularios enormes. Todos los campos serán opcionales salvo los estrictamente necesarios.

### Simple primero, profundidad después

La complejidad se revelará mediante **progressive disclosure**.

El usuario común ve lo esencial. El usuario avanzado puede ampliar el mismo flujo.

### Mostrar primero lo importante

Al abrir la aplicación el usuario debe entender rápidamente:

- día del cultivo;
- etapa;
- últimos parámetros;
- último riego;
- problemas activos;
- última actividad.

### Evitar duplicación

Un dato se registra una vez y puede mostrarse en diferentes vistas.

### Historial siempre accesible

Debe ser fácil volver a una fecha, evento o fotografía anterior.

### Smooth no significa lenta

Animaciones y transiciones:

- cortas;
- consistentes;
- funcionales;
- sin bloquear interacción;
- con soporte para reducción de movimiento.

### Feedback inmediato

Al guardar, editar, eliminar, cambiar de etapa o resolver un problema, la UI debe confirmar claramente qué ocurrió.

Evitar mensajes robóticos cuando pueda usarse lenguaje natural.

Ejemplo:

> **Todo guardado. Tu cultivo ya está al día.**

en lugar de:

> Registro creado exitosamente.

### Mobile first de verdad

Los flujos deben diseñarse primero para una mano y una pantalla pequeña, no simplemente adaptar desktop mediante media queries.

### Identidad sin ruido

La marca puede tener personalidad, humor y recursos gráficos, pero las pantallas operativas deben seguir siendo limpias. La identidad nunca debe competir con los datos.

### Consistencia

Inputs, cards, modales, sheets, botones, animaciones, estados y espaciados deben pertenecer al mismo sistema visual.

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

Growndona cumple su objetivo inicial si un usuario puede:

> Crear un cultivo, registrar regularmente lo que sucede, consultar cómo está actualmente y meses después reconstruir fácilmente todo lo ocurrido.

La validación no debe medirse solo por registros de cuenta.

Métricas más útiles:

- porcentaje de usuarios que crean su primer cultivo;
- porcentaje que realiza un primer registro;
- usuarios que vuelven a registrar después de 7, 14 y 30 días;
- cantidad de registros por cultivo activo;
- porcentaje de cultivos que llegan a etapas posteriores;
- uso de fotos, timeline y gráficos;
- adopción de modo Simple vs Avanzado cuando exista;
- conversión de prueba a pago único cuando se implemente.

**Retención de uso > cantidad de cuentas creadas.**

---

# 38. Resumen funcional

Growndona será principalmente:

> **Un diario digital visual, simple y cercano para registrar todo el ciclo de un cultivo.**

Núcleo:

**Cultivos → plantas/genéticas → períodos → días → parámetros + acciones + riegos + problemas + fotos + notas.**

Evolución:

**Registro Simple/Avanzado → timeline → gráficos → estadísticas → comparación → informe final.**

La arquitectura y gran parte del núcleo ya existen. La v1.2 concentra el siguiente trabajo en **calidad de experiencia, diferenciación, monetización accesible y comunicación de producto**.

---

# 39. Posicionamiento competitivo

Growndona no intentará competir por cantidad de funcionalidades contra plataformas maduras.

La propuesta será:

> **Registrar tu cultivo, sin vueltas.**

Pilares:

1. **Simplicidad.**
2. **Rapidez.**
3. **Profundidad opcional.**
4. **Historial visual.**
5. **Genéticas bien representadas.**
6. **Privacidad.**
7. **Identidad argentina y cercanía.**
8. **Precio accesible y pago único.**

La comparación estratégica no debe ser “tenemos más funciones”, sino:

> **Hacemos más simple la tarea que más repetís.**

---

# 40. Identidad argentina y tono de producto

Growndona se desarrollará primero pensando en usuarios argentinos y luego en LATAM.

La identidad argentina debe sentirse, **no gritarse**.

## Sí

- español natural;
- terminología que usa el cultivador local;
- mensajes cercanos;
- humor puntual;
- identidad visual propia;
- colaboraciones locales;
- precios y soporte pensados para el mercado;
- una marca reconocible fuera de la pantalla.

## No

- llenar la interfaz de banderas;
- clichés constantes;
- referencias futboleras en cada pantalla;
- sacrificar claridad por un chiste;
- usar “nacionalismo” como decoración superficial.

La sensación buscada:

> **Esta app la hizo gente que entiende cómo cultivo yo.**

Ejemplos de microcopy:

- “Todo guardado.”
- “Tu cultivo ya está al día.”
- “Todavía no registraste nada hoy.”
- “Cuando tengas las mediciones, cargalas acá.”
- “Podés cambiar esto después.”

---

# 41. Monetización

## Modelo

Growndona se orientará inicialmente a **pago único**, no suscripción obligatoria.

## Precio

Rango objetivo:

> **USD 4,20 – USD 14,20**

El precio exacto queda pendiente de validación.

Opciones a evaluar antes de lanzamiento:

- USD 4,20 como entrada/promoción puntual;
- precio Founder cercano a USD 10–14,20;
- USD 14,20 como precio lifetime inicial;
- conversión local a ARS claramente visible cuando corresponda.

El precio de **USD 42 queda descartado de la estrategia actual** y debe desaparecer de la landing.

## Prueba

Puede mantenerse una prueba gratuita si sirve para que el usuario cree un cultivo y experimente el flujo antes de pagar.

La prueba no debe anunciar un límite que todavía no existe técnicamente.

## Lifetime

Cuando se implemente:

- guardar acceso de por vida en la cuenta;
- no quitar posteriormente funciones ya compradas;
- definir claramente qué servicios dependientes de costo continuo pueden tener límites razonables, especialmente almacenamiento.

---

# 42. Estrategia de imágenes y costos

Las fotografías son parte central del historial, pero un pago único no debe prometer almacenamiento infinito.

Antes del lanzamiento:

1. comprimir/redimensionar imágenes en cliente;
2. medir peso promedio real;
3. registrar uso de almacenamiento por usuario;
4. definir cuota;
5. avisar antes de llegar al límite;
6. evaluar ampliaciones futuras solo si los datos reales lo justifican.

Supabase Free se mantiene durante desarrollo mientras alcance.

El salto a Pro debe realizarse por necesidad de producción/usuarios, no únicamente por anticipación.

La cuota final **no queda cerrada en este PRD** hasta medir una beta real.

---

# 43. Exportación / Informe de cultivo

La exportación deja de ser una mejora secundaria y pasa a ser una funcionalidad de alto valor para una etapa posterior inmediata.

Objetivo:

> Convertir meses de registros en un documento visual que el usuario quiera conservar.

Contenido posible:

- portada;
- nombre del cultivo;
- fechas;
- duración total;
- genéticas;
- cantidad de plantas;
- etapas y duración;
- estadísticas principales;
- evolución de parámetros;
- acciones relevantes;
- problemas y resolución;
- selección de fotografías;
- cosecha/peso final;
- notas finales.

Salida principal:

- PDF visual.
- Versión preparada para guardar o compartir.

No requiere convertir los cultivos en públicos.

---

# 44. Landing v2

La landing actual debe ampliarse para representar correctamente el producto que estamos construyendo.

## Objetivos

1. Explicar qué problema resuelve.
2. Mostrar la aplicación real.
3. Mostrar que registrar es rápido.
4. Comunicar Simple vs Avanzado.
5. Mostrar trabajo por genética.
6. Mostrar timeline, gráficos y fotos.
7. Explicar privacidad.
8. Comunicar identidad y cercanía.
9. Explicar pago único.
10. Convertir a prueba/registro.

## Estructura sugerida

### Hero

- propuesta corta;
- captura real de producto;
- CTA principal;
- mensaje de prueba sin tarjeta si aplica.

### Problema

“Fotos sueltas, notas, mensajes y mediciones desperdigadas.”

### Cómo funciona

1. Creá tu cultivo.
2. Registrá el día.
3. Mirá cómo evoluciona.

### Registro Simple / Avanzado

Mostrar visualmente que Growndona sirve tanto para alguien que solo quiere anotar lo esencial como para quien necesita mayor profundidad.

### Genéticas

Explicar que cultivos con varias genéticas pueden registrar parámetros diferenciados sin obligar a cargar planta por planta.

### Historial visual

Timeline + fotos + etapas.

### Datos y gráficos

Mostrar parámetros actuales y futura profundidad avanzada sin vender funciones que todavía no existen.

### Privacidad

“Tu cultivo es tuyo.”

### Informe de cultivo

Marcar como “próximamente” hasta que exista.

### Precio

- eliminar USD 42;
- comunicar pago único;
- usar el precio final solo cuando esté decidido;
- mientras tanto evitar promesas contradictorias.

### Preguntas frecuentes

- ¿Necesito saber de cultivo para usarla?
- ¿Funciona desde el celular?
- ¿Puedo tener varias genéticas?
- ¿Mis fotos son privadas?
- ¿Es una suscripción?
- ¿Puedo instalarla como app?
- ¿Qué pasa cuando termino un cultivo?

### CTA final

Repetir una única acción principal.

---

# 45. Roadmap actualizado

## Bloque A — UX del producto actual

- auditoría de flujos mobile;
- sistema de animaciones/transiciones;
- feedback de formularios;
- estados vacíos;
- microcopy;
- accesibilidad básica;
- pulido PWA.

## Bloque B — Registro Simple / Avanzado

- selector;
- persistencia de preferencia;
- definición final de parámetros avanzados;
- schema/migrations necesarias;
- gráficos compatibles.

## Bloque C — Historial y análisis

- calendario;
- estadísticas;
- comparación por genética;
- galería evolucionada;
- resumen final;
- PDF.

## Bloque D — Lanzamiento

- landing v2;
- compresión de fotos;
- política de almacenamiento;
- checkout;
- acceso lifetime;
- prueba;
- analytics de producto;
- beta con usuarios reales.

## Bloque E — Después de validar

- comparaciones entre cultivos;
- recordatorios;
- riegos avanzados;
- nutrientes;
- timelapse;
- historial de una genética entre diferentes cultivos.

---

# 46. Principio rector

Cada nueva funcionalidad deberá superar esta pregunta:

> **¿Hace más fácil registrar, entender o recordar el cultivo?**

Si la respuesta es no, no es prioridad.

Growndona no necesita ser la aplicación con más funciones.

Necesita ser la aplicación que el usuario **quiera abrir todos los días**.
