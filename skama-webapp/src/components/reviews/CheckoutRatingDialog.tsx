import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import { Dialog } from '../dialogs';
import type { ICheckoutItem } from '../../utils';

export type CheckoutRatingValue = 1 | 2 | 3 | 4 | 5;

interface ICheckoutRatingDialogProps {
  open: boolean;
  items: ICheckoutItem[];
  ratingsByItemId: Partial<Record<string, CheckoutRatingValue>>;
  validationMessage: string;
  isSubmitting: boolean;
  onClose: () => void;
  onRatingChange: (itemId: string, rating: CheckoutRatingValue) => void;
  onSubmit: () => void;
}

const ratingValues: CheckoutRatingValue[] = [1, 2, 3, 4, 5];

function formatSelectedRating(rating?: CheckoutRatingValue): string {
  return rating ? `${rating}/5` : 'Sin calificar';
}

export function CheckoutRatingDialog({
  open,
  items,
  ratingsByItemId,
  validationMessage,
  isSubmitting,
  onClose,
  onRatingChange,
  onSubmit,
}: ICheckoutRatingDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      title="Califica tus productos"
      maxWidth="md"
      actions={
        <>
          <button
            className="sk-button sk-button--secondary"
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Volver
          </button>
          <button
            className="sk-button sk-button--primary"
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mi calificación'}
          </button>
        </>
      }
    >
      <div className="sk-checkout-rating">
        <p>
          Antes de abrir WhatsApp, califica cada producto de tu orden.
        </p>

        <div className="sk-checkout-rating__list">
          {items.map((item) => {
            const selectedRating = ratingsByItemId[item.id];

            return (
              <article className="sk-checkout-rating__item" key={item.id}>
                <img
                  src={item.imageUrl || '/assets/images/hero/skama-hero-jewelry-detail.png'}
                  alt={item.imageAlt || item.name}
                  loading="lazy"
                />
                <div className="sk-checkout-rating__content">
                  <div>
                    <h3>{item.name}</h3>
                    <span>Cantidad {item.quantity}</span>
                  </div>

                  <div
                    className="sk-star-rating"
                    role="radiogroup"
                    aria-label={`Calificación para ${item.name}`}
                  >
                    {ratingValues.map((rating) => {
                      const isSelected = selectedRating === rating;
                      const isFilled = Boolean(selectedRating && rating <= selectedRating);

                      return (
                        <button
                          className={`sk-star-button${isFilled ? ' is-selected' : ''}`}
                          key={rating}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={`${rating} de 5 para ${item.name}`}
                          disabled={isSubmitting}
                          onClick={() => onRatingChange(item.id, rating)}
                        >
                          {isFilled ? (
                            <StarIcon fontSize="small" />
                          ) : (
                            <StarBorderIcon fontSize="small" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <strong className="sk-checkout-rating__value">
                    {formatSelectedRating(selectedRating)}
                  </strong>
                </div>
              </article>
            );
          })}
        </div>

        {validationMessage && (
          <p className="sk-validation" data-state="invalid" aria-live="polite">
            {validationMessage}
          </p>
        )}
      </div>
    </Dialog>
  );
}
