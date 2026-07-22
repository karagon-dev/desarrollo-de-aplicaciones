import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { Card } from '../cards';
import { TextArea, Select } from '../inputs';
import { Button } from '../buttons';
import { Text } from '../typography';
import { reviewService } from '../../services';
import { getApiErrorMessage, tokens } from '../../utils';
import type { IEligibleReviewOrder } from '../../hooks/useEligibleReviewOrders';

export interface ReviewFormProps {
  userId: string;
  productId: string;
  eligibleOrders: IEligibleReviewOrder[];
  loadingOrders?: boolean;
  onSuccess: () => void;
}

const ratingOptions = [
  { value: '5', label: '5 - Excellent' },
  { value: '4', label: '4 - Very good' },
  { value: '3', label: '3 - Good' },
  { value: '2', label: '2 - Fair' },
  { value: '1', label: '1 - Poor' },
];

export function ReviewForm({
  userId,
  productId,
  eligibleOrders,
  loadingOrders = false,
  onSuccess,
}: ReviewFormProps) {
  const [orderId, setOrderId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const orderOptions = eligibleOrders.map((order) => ({
    value: order.orderId,
    label: order.orderNumber,
  }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!orderId) {
      toast.error('Select the order associated with your purchase.');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.create({
        userId,
        productId,
        orderId,
        rating: Number(rating),
        comment: comment.trim(),
      });
      toast.success('Review published.');
      setComment('');
      setOrderId('');
      onSuccess();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not publish the review.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingOrders) {
    return (
      <Card>
        <Text variant="body" muted>
          Verificando orders elegibles...
        </Text>
      </Card>
    );
  }

  if (eligibleOrders.length === 0) {
    return (
      <Card>
        <Text variant="body" muted>
          Buy this product to leave a review.
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}
      >
        <Text variant="h3">Write review</Text>
        <Select
          label="Order"
          options={orderOptions}
          value={orderId}
          required
          onChange={(event) => setOrderId(String(event.target.value))}
        />
        <Select
          label="Rating"
          options={ratingOptions}
          value={rating}
          onChange={(event) => setRating(String(event.target.value))}
        />
        <TextArea
          label="Comment"
          rows={3}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <Button type="submit" disabled={submitting} sx={{ alignSelf: 'flex-start' }}>
          {submitting ? 'Publishing...' : 'Publish review'}
        </Button>
      </Box>
    </Card>
  );
}
