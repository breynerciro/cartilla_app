import re

with open('INFORME_TECNICO.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Renumber headers 4 to 11 -> 6 to 13
def renumber(match):
    num = int(match.group(1))
    if 4 <= num <= 11:
        return f'<h2{" " if match.group(0).startswith("<h2 ") else ">"}{num+2}.'
    return match.group(0)

def renumber_sub(match):
    num1 = int(match.group(1))
    num2 = int(match.group(2))
    if 4 <= num1 <= 11:
        return f'<h3>{num1+2}.{num2}'
    return match.group(0)

# Temporarily replace <h2> and <h3> prefixes
content = re.sub(r'<h2.*?>(\d+)\.', renumber, content)
content = re.sub(r'<h3>(\d+)\.(\d+)', renumber_sub, content)

# 2. Insert sections 4 and 5 before section 6 (which was 4)
new_sections = """<h2>4. ANTECEDENTES Y ESTADO DEL ARTE</h2>
        <p>La investigación científica ha documentado extensivamente los desafíos del cuidado oral en pacientes hemofílicos. Según Bravo y Muñoz (2016), los procedimientos odontológicos en población pediátrica con hemofilia son complejos y pueden requerir hospitalización debido a hemorragias post-extracción. Córdova et al. (2020) demostraron que es posible realizar procedimientos preventivos y restaurativos reduciendo la terapia de reemplazo, pero esto exige protocolos específicos y personal especializado. Además, Ramírez (2016) concluyó que el abordaje debe enfocarse en la atención primaria y prevención para evitar tratamientos invasivos, destacando la necesidad crítica de herramientas educativas para cuidadores.</p>
        <p>En el ecosistema actual de aplicaciones móviles para el manejo de la hemofilia, existen soluciones como <em>HemMobile® (Pfizer)</em>, <em>SOS Hemofilia</em> y <em>Microhealth Bleeding Disorders</em>, orientadas al registro de infusiones y seguimiento de sangrados. Sin embargo, <strong>ninguna de estas aplicaciones aborda específicamente el cuidado oral pediátrico</strong>, lo que evidencia una brecha importante en las herramientas digitales para la hemofilia que este desarrollo resuelve.</p>
        <hr>
        <h2>5. METODOLOGÍA Y FASES DE DESARROLLO</h2>
        <p>El desarrollo de la aplicación se planificó y ejecutó a lo largo de 16 semanas bajo un enfoque estructurado, dividiéndose en las siguientes fases principales alineadas con las prácticas de ingeniería de software:</p>
        <ul>
            <li><strong>Fase 1 (Semanas 1-2):</strong> Iniciación, planificación conceptual y análisis de requerimientos (funcionales y no funcionales).</li>
            <li><strong>Fase 2 (Semanas 3-4):</strong> Diseño de interfaz y experiencia de usuario (UI/UX) basándose en metodologías centradas en el usuario.</li>
            <li><strong>Fase 3 (Semanas 5-11):</strong> Configuración del entorno de desarrollo (React Native/Expo) y desarrollo frontend intensivo para funcionalidades core y motor anatómico.</li>
            <li><strong>Fase 4 (Semanas 12-16):</strong> Integración de características avanzadas, pruebas y validación del sistema, despliegue final y consolidación de la documentación.</li>
        </ul>
        <hr>
        <h2>6. STACK"""

content = content.replace("<h2>6. STACK", new_sections)

# 3. Append Bibliografia at the end (before closing tags)
bibliografia = """<hr>
        <h2>14. REFERENCIAS BIBLIOGRÁFICAS</h2>
        <ul>
            <li>Ashemadrid. (2022). <em>Tratamiento dental en pacientes infantiles con Hemofilia A</em>. Recuperado de: https://ashemadrid.org</li>
            <li>Aguirre, P. A. L., & Bejarano, L. Y. G. (2025). <em>Diseño de una app para el cuidado oral del paciente pediátrico con hemofilia</em>.</li>
            <li>Bravo, L., & Muñoz, M. (2016). Casos clínicos en manejo odontológico de hemofilia pediátrica.</li>
            <li>Córdova, E., et al. (2020). Medidas alternativas de hemostasia en procedimientos dentales de pacientes hemofílicos.</li>
            <li>Ramírez, A. (2016). Revisión sistemática sobre el tratamiento odontológico en niños con hemofilia A.</li>
            <li>Nicklaus Children's Hospital. (s.f.). <em>Salud dental en niños con hemofilia</em>.</li>
            <li>Cecilia, G. M. M., Leonardo, C. A. L., & Byron, M. D. (2014). Metodología para el desarrollo de aplicaciones móviles.</li>
            <li>Alonso-Arévalo, J., & Mirón-Canelo, J. A. (2017). Aplicaciones móviles en salud: potencial, normativa de seguridad y regulación.</li>
        </ul>
    </div>
"""

content = content.replace("</div>\n\n    <!-- Botón de Exportación a PDF -->", bibliografia + "\n    <!-- Botón de Exportación a PDF -->")

with open('INFORME_TECNICO.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML file updated successfully")
