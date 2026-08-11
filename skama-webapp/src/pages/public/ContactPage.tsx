import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const contactCards = [
  {
    title: 'Sucursal Principal',
    body: ['Jac\u00f3, Puntarenas'],
    Icon: LocationOnOutlinedIcon,
  },
  {
    title: 'Instagram',
    body: ['@skamajewelryoficial'],
    href: 'https://www.instagram.com/skamajewelryoficial/',
    Icon: InstagramIcon,
  },
  {
    title: 'WhatsApp',
    body: ['+506 72054536'],
    href: 'https://wa.me/50672054536',
    Icon: WhatsAppIcon,
  },
  {
    title: 'Correo',
    body: ['administracionskama@gmail.com'],
    href: 'mailto:administracionskama@gmail.com',
    Icon: EmailOutlinedIcon,
  },
  {
    title: 'Horario',
    body: ['Lunes a s\u00e1bado', '9:00 a.m. - 7:00 p.m.', 'Domingo', '10:00 a.m. - 5:00 p.m.'],
    Icon: ScheduleOutlinedIcon,
  },
];

export function ContactPage() {
  return (
    <div className="sk-page sk-contact-page">
      <section className="sk-contact-section" aria-labelledby="contact-title">
        <div className="sk-contact-heading">
          <p className="sk-kicker">Contacto</p>
          <h1 id="contact-title">{'Cont\u00e1ctanos'}</h1>
          <p>
            {
              'Estamos disponibles para acompa\u00f1ar cada visita, coordinar pedidos especiales y brindar asesor\u00eda personalizada.'
            }
          </p>
        </div>

        <div className="sk-contact-grid" aria-label="Información de contacto">
          {contactCards.map(({ title, body, href, Icon }) => {
            const cardContent = (
              <>
                <span className="sk-contact-card__icon" aria-hidden="true">
                  <Icon fontSize="inherit" />
                </span>
                <h2>{title}</h2>
                <p>
                  {body.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </>
            );

            return href ? (
              <a className="sk-card sk-contact-card" href={href} key={title} target="_blank" rel="noreferrer">
                {cardContent}
              </a>
            ) : (
              <article className="sk-card sk-contact-card" key={title}>
                {cardContent}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
