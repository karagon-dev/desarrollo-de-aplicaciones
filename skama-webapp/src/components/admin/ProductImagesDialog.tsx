import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Dialog } from '../dialogs';
import { Button } from '../buttons';
import { Loading, Chip } from '../feedback';
import { Text } from '../typography';
import { useProductImages } from '../../hooks';
import { productImageService } from '../../services';
import type { IProductDto } from '../../types';
import { getApiErrorMessage, resolveAssetUrl, tokens } from '../../utils';

export interface ProductImagesDialogProps {
  open: boolean;
  product: IProductDto | null;
  onClose: () => void;
}

export function ProductImagesDialog({ open, product, onClose }: ProductImagesDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { images, loading, error, refetch } = useProductImages(open ? product?.id : undefined);
  const [uploading, setUploading] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !product) {
      return;
    }

    setUploading(true);
    try {
      await productImageService.upload(product.id, {
        file,
        isMain: images.length === 0,
      });
      toast.success('Image uploaded successfully.');
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not upload image.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleSetMain(imageId: string) {
    setWorkingId(imageId);
    try {
      await productImageService.setMain(imageId);
      toast.success('Main image updated.');
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not mark as main.'));
    } finally {
      setWorkingId(null);
    }
  }

  async function handleDelete(imageId: string) {
    setWorkingId(imageId);
    try {
      await productImageService.delete(imageId);
      toast.success('Image deleted.');
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not delete image.'));
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={product ? `Images - ${product.name}` : 'Product images'}
      actions={
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
        <Box sx={{ display: 'flex', gap: tokens.spacing.sm, alignItems: 'center' }}>
          <Button
            variant="outline"
            disabled={uploading || !product}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : 'Upload image'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            hidden
            onChange={(event) => void handleUpload(event)}
          />
          <Text variant="caption" muted>
            JPG, PNG, or WEBP - max. 5 MB
          </Text>
        </Box>

        {loading ? (
          <Loading message="Loading images..." />
        ) : error ? (
          <Text variant="small" sx={{ color: tokens.color.danger }}>
            {error}
          </Text>
        ) : images.length === 0 ? (
          <Text variant="body" muted>
            This product does not have images yet.
          </Text>
        ) : (
          <Grid container spacing={2}>
            {images.map((image) => {
              const imageUrl = resolveAssetUrl(image.imageUrl);
              const isWorking = workingId === image.id;

              return (
                <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    sx={{
                      border: `1px solid ${tokens.color.border}`,
                      borderRadius: tokens.radius.md,
                      overflow: 'hidden',
                      backgroundColor: tokens.color.surfaceSecondary,
                    }}
                  >
                    <Box
                      sx={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tokens.color.muted,
                      }}
                    >
                      {imageUrl ? (
                        <Box
                          component="img"
                          src={imageUrl}
                          alt={image.imageName}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        'No preview'
                      )}
                    </Box>
                    <Box
                      sx={{
                        p: tokens.spacing.sm,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: tokens.spacing.sm,
                      }}
                    >
                      {image.isMain ? (
                        <Chip label="Main" chipVariant="primary" size="small" />
                      ) : (
                        <IconButton
                          size="small"
                          aria-label="Mark as main"
                          disabled={isWorking}
                          onClick={() => void handleSetMain(image.id)}
                        >
                          <StarBorderOutlinedIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        aria-label="Delete imagen"
                        disabled={isWorking}
                        onClick={() => void handleDelete(image.id)}
                        sx={{ color: tokens.color.danger, ml: 'auto' }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Dialog>
  );
}
