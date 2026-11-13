# Componente para INFT S.A.

Esta carpeta es **independiente** del sitio MuniTotal y no participa en su compilación.

1. Copiar `MuniTotalBusinessUnit.tsx` y `MuniTotalBusinessUnit.css` a la carpeta de componentes del repositorio existente de `www.inft.com.ar`.
2. En la vista que muestra las **Unidades de Negocio**, importar el componente y renderizar `<MuniTotalBusinessUnit />` como la nueva tercera unidad.
3. Si el sitio tiene enlaces de navegación hacia las unidades, agregar `MuniTotal` apuntando a `#munitotal` o al dominio externo.
4. Si el formulario institucional ofrece selector de unidades, agregar valor `MuniTotal` y revisar validación del PHP del sitio INFT para admitirlo.
5. Ajustar tipografía y color del componente a las variables globales reales si es necesario.
6. Verificar con el cliente el texto «más de 25 años»; el sitio INFT existente declara desde 1988.

El archivo está aislado bajo clases `inft-munitotal__*` para minimizar conflictos CSS.
