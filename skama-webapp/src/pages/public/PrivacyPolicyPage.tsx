const policySections = [
  {
    title: 'Informaci\u00f3n recopilada',
    text:
      'Recopilamos datos personales necesarios para gestionar pedidos, coordinar entregas, dar seguimiento a solicitudes y brindar una atenci\u00f3n m\u00e1s precisa. Esta informaci\u00f3n puede incluir nombre, correo electr\u00f3nico, tel\u00e9fono, direcci\u00f3n y datos asociados al historial de compra.',
  },
  {
    title: 'Uso de la informaci\u00f3n',
    text:
      'Los datos personales \u00fanicamente son utilizados para gestionar pedidos, responder consultas, mejorar la experiencia de atenci\u00f3n y mantener una comunicaci\u00f3n clara con cada cliente durante el proceso de compra.',
  },
  {
    title: 'Protecci\u00f3n de datos',
    text:
      'Toda la informaci\u00f3n es almacenada de manera segura. La plataforma implementa buenas pr\u00e1cticas de seguridad inform\u00e1tica para proteger informaci\u00f3n sensible y reducir riesgos de acceso no autorizado.',
  },
  {
    title: 'Confidencialidad',
    text:
      'No compartimos informaci\u00f3n personal con terceros. Toda la informaci\u00f3n financiera y personal es tratada con absoluta confidencialidad y solo se utiliza para los fines relacionados con la experiencia de compra y atenci\u00f3n.',
  },
  {
    title: 'Cookies',
    text:
      'Este sitio puede utilizar cookies para mejorar la navegaci\u00f3n, recordar preferencias y analizar el rendimiento de la experiencia digital. El usuario puede administrar estas preferencias desde la configuraci\u00f3n de su navegador.',
  },
  {
    title: 'Derechos del usuario',
    text:
      'Cada cliente puede solicitar la revisi\u00f3n, actualizaci\u00f3n o eliminaci\u00f3n de sus datos personales cuando lo considere necesario, escribiendo a nuestros canales oficiales de atenci\u00f3n.',
  },
];

export function PrivacyPolicyPage() {
  return (
    <div className="sk-page sk-legal-page">
      <section className="sk-legal-section" aria-labelledby="privacy-policy-title">
        <div className="sk-legal-heading">
          <p className="sk-kicker">{'Informaci\u00f3n legal'}</p>
          <h1 id="privacy-policy-title">{'Pol\u00edtica de Privacidad'}</h1>
          <p>
            {
              'La informaci\u00f3n personal se gestiona con discreci\u00f3n, responsabilidad y buenas pr\u00e1cticas de seguridad para proteger la confianza de cada cliente.'
            }
          </p>
        </div>

        <div className="sk-legal-grid">
          {policySections.map((section) => (
            <article className="sk-card sk-legal-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </div>

        <article className="sk-card sk-legal-card sk-legal-card--wide">
          <span className="sk-kicker">Seguridad</span>
          <h2>{'Protecci\u00f3n de credenciales'}</h2>
          <p>
            {
              'Las contrase\u00f1as se encuentran protegidas mediante mecanismos seguros. El tratamiento de credenciales y datos sensibles se realiza aplicando medidas orientadas a preservar la confidencialidad, integridad y disponibilidad de la informaci\u00f3n.'
            }
          </p>
        </article>
      </section>
    </div>
  );
}
