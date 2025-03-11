# Lost Ark Bus Tool

Una herramienta para calcular automáticamente los precios y distribución de oro para buses (carries) en Lost Ark.

## Características

- Selección de raid (Echidna, Kakul-Saydon, etc.)
- Cálculo automático de la cantidad de buyers basado en la raid seleccionada y el número de drivers
- Cálculo del precio a listar para cada buyer para una distribución equitativa del oro
- Interfaz de usuario intuitiva y fácil de usar

## Tecnologías

- React 19
- Vite
- Tailwind CSS
- React Router
- Formik y Yup para manejo de formularios

## Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Uso

1. Selecciona la raid que vas a bussear
2. Indica el número de drivers
3. Establece el precio total del bus
4. La herramienta calculará automáticamente cuánto oro debe listar cada buyer

## Desarrollo

Este proyecto fue creado con Vite y React. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
