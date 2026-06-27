import re

with open('INFORME_TECNICO.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add gallery CSS
css_gallery = """
        .gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-top: 1.5rem;
            margin-bottom: 2rem;
            page-break-inside: avoid;
        }
        .gallery figure {
            margin: 0;
            text-align: center;
        }
        .gallery img {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .gallery figcaption {
            font-size: 9pt;
            color: #555;
            margin-top: 0.5rem;
            font-style: italic;
        }
        /* Botón de exportación flotante */"""

content = content.replace("        /* Botón de exportación flotante */", css_gallery)

# Add gallery to Section 10
section_10_html = """<h2>10. ARQUITECTURA DE INTERFAZ Y COMPONENTES</h2>
        <p>Para garantizar la mantenibilidad y consistencia visual de la aplicación sin comprometer el rendimiento, la
            interfaz de usuario se construyó sobre un sistema de componentes reutilizables con responsabilidades bien
            delimitadas.</p>
        <p>Se desarrollaron componentes genéricos (<code>Button</code>, <code>NextButton</code>,
            <code>AlertBanner</code>, <code>TopicCard</code>, etc.) que encapsulan la lógica visual (colores,
            tipografías normalizadas para múltiples pantallas y espaciados). Esto asegura que el código de las pantallas
            principales se enfoque exclusivamente en la orquestación del flujo de navegación y en el modelo de datos
            clínico.
        </p>
        
        <h3>10.1 Evidencia Visual de la Interfaz</h3>
        <p>A continuación se presenta evidencia de la implementación de la interfaz gráfica, demostrando la fidelidad del diseño frente a los requerimientos de usabilidad pediátrica y la integración anatómica interactiva:</p>
        
        <div class="gallery">
            <figure>
                <img src="assets/mockups/MockupsCartilla_page-0002.jpg" alt="Pantalla de Inicio">
                <figcaption>Figura 1. Pantalla de Bienvenida y Onboarding</figcaption>
            </figure>
            <figure>
                <img src="assets/mockups/MockupsCartilla_page-0008.jpg" alt="Diagrama Interactivo Dental">
                <figcaption>Figura 2. Motor de Renderizado Anatómico Dental</figcaption>
            </figure>
            <figure>
                <img src="assets/mockups/MockupsCartilla_page-0012.jpg" alt="Alerta Médica">
                <figcaption>Figura 3. Tarjetas de Información y Alertas Médicas</figcaption>
            </figure>
        </div>
        <hr>"""

content = re.sub(r'<h2>10\. ARQUITECTURA DE INTERFAZ Y COMPONENTES</h2>.*?</p>\s*<hr>', section_10_html, content, flags=re.DOTALL)

with open('INFORME_TECNICO.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Gallery added")
