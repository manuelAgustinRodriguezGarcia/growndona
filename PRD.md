# PRD — Growndona

**Versión:** 1.0
**Estado:** Definición inicial
**Plataforma:** Aplicación web responsive
**Stack definido:** Next.js + Supabase
**Enfoque inicial:** MVP funcional
**IA:** Fuera del alcance
**Monetización:** Fuera del MVP

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

La estructura general será:

```text
Usuario
 └── Cultivos
      ├── Períodos
      ├── Registros diarios
      │    ├── Parámetros
      │    ├── Fotos
      │    ├── Riegos
      │    ├── Acciones
      │    └── Notas
      │
      └── Problemas
```

Un usuario puede tener varios cultivos.

Cada cultivo tendrá su propio historial independiente.

---

# 6. Cultivos

El usuario podrá crear un nuevo cultivo.

## Datos iniciales

Como mínimo:

* Nombre del cultivo.
* Fecha de inicio.
* Cantidad de plantas.

Opcionalmente:

* Variedad/genética.
* Método de cultivo.
* Tipo de sustrato o medio.
* Cultivo interior/exterior.
* Descripción.
* Foto principal.

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

Los cultivos finalizados seguirán disponibles para consulta.

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

El usuario podrá indicar cuándo comienza un nuevo período.

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

* Temperatura.
* Humedad.
* pH.
* EC.
* PPM.

Ejemplo:

```text
Temperatura: 24 °C
Humedad: 61 %
pH: 5.9
EC: 1.2
PPM: 620
```

Los campos serán opcionales.

No será necesario completar todos los parámetros para guardar una entrada.

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

Las imágenes se almacenarán utilizando **Supabase Storage**.

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

Esto permitirá visualizar fácilmente la evolución de las plantas.

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
* Fotografías opcionales.

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
* Fotos.
* Riegos.
* Problemas.
* Información del cultivo.

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

En mobile, **Registrar** puede funcionar como acción principal destacada.

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

Cada usuario tendrá acceso exclusivamente a sus propios datos privados.

---

# 28. Base de datos inicial

Sin definir todavía cada columna exacta, las entidades principales serían:

```text
profiles
cultivations
cultivation_periods
daily_entries
measurements
actions
irrigations
problems
photos
```

Relación general:

```text
profiles
   ↓
cultivations
   ↓
daily_entries
   ├── measurements
   ├── actions
   ├── irrigations
   └── photos

cultivations
   ├── cultivation_periods
   └── problems
```

Esto mantiene una estructura suficientemente clara sin complicar demasiado la aplicación.

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

Para evitar hacer una aplicación enorme desde el comienzo, el **MVP de Growndona** incluirá:

1. Registro e inicio de sesión.
2. Perfil básico.
3. Crear cultivo.
4. Editar cultivo.
5. Finalizar cultivo.
6. Períodos del cultivo.
7. Contador de días.
8. Registro diario.
9. Temperatura.
10. Humedad.
11. pH.
12. EC.
13. PPM.
14. Fotos.
15. Notas.
16. Riegos.
17. Podas/acciones.
18. Registro de problemas.
19. Timeline.
20. Galería.
21. Dashboard del cultivo.
22. Listado de cultivos activos/finalizados.
23. Gráficos básicos de parámetros.

Con esto **ya tenemos un producto funcional y con una finalidad clara**.

---

# 31. Fuera del MVP

No deberíamos meter estas funcionalidades ahora:

* Inteligencia artificial.
* Chatbot.
* Reconocimiento de problemas mediante fotografías.
* Marketplace.
* Suscripciones.
* Plan Pro.
* Pagos.
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

Después del MVP se podrían desarrollar:

* Comparación entre cultivos.
* Comparación de fotografías.
* Estadísticas históricas.
* Calendario avanzado.
* Recordatorios.
* Más tipos de acciones.
* Nutrientes.
* Registro avanzado de riegos.
* Seguimiento individual por planta.
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

Este PRD ya está suficientemente definido como para que el próximo paso sea **bajar esto a arquitectura de pantallas, modelo de datos de Supabase y funcionalidades exactas por página**. Después de eso sí tendría sentido construir el **one-shot prompt completo para generar la primera versión de Growndona**.
