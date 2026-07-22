import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Input } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { Text } from '../../components/typography';
import { Loading, ErrorState } from '../../components/feedback';
import { useAuth, useCustomerProfile } from '../../hooks';
import { tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

interface IProfileFormState {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  phone: string;
  birthDate: string;
}

function mapProfileToForm(profile: {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  phone: string;
  birthDate: string | null;
}): IProfileFormState {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    identificationNumber: profile.identificationNumber,
    phone: profile.phone ?? '',
    birthDate: profile.birthDate ?? '',
  };
}

const emptyForm: IProfileFormState = {
  firstName: '',
  lastName: '',
  identificationNumber: '',
  phone: '',
  birthDate: '',
};

export function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, saving, error, isNewProfile, refetch, saveProfile } =
    useCustomerProfile(user?.userId);

  const [form, setForm] = useState<IProfileFormState>(emptyForm);

  useEffect(() => {
    if (profile) {
      setForm(mapProfileToForm(profile));
    } else if (!loading) {
      setForm(emptyForm);
    }
  }, [profile, loading]);

  if (loading) {
    return <Loading fullPage message="Loading profile..." />;
  }

  if (error && !profile) {
    return <ErrorState description={error} onRetry={() => void refetch()} />;
  }

  function updateField<K extends keyof IProfileFormState>(field: K, value: IProfileFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await saveProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        identificationNumber: form.identificationNumber.trim(),
        phone: form.phone.trim() || null,
        birthDate: form.birthDate || null,
      });
      toast.success(isNewProfile ? 'Profile created successfully.' : 'Profile updated.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save the profile.');
    }
  }

  return (
    <PageShell
      title="My profile"
      subtitle="Manage your personal information"
      breadcrumbs={[
        { label: 'Home', path: ROUTES.home },
        { label: 'My profile' },
      ]}
    >
      <Card>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}
        >
          <Input
            label="Email address"
            value={user?.email ?? ''}
            disabled
            helperText="Email cannot be changed here"
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="First name"
                required
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="Last name"
                required
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="Identification"
                required
                value={form.identificationNumber}
                onChange={(event) => updateField('identificationNumber', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="Phone"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="Date de nacimiento"
                type="date"
                value={form.birthDate}
                onChange={(event) => updateField('birthDate', event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          {error && profile && (
            <Text variant="small" sx={{ color: tokens.color.danger }}>
              {error}
            </Text>
          )}

          <Button type="submit" disabled={saving} sx={{ alignSelf: 'flex-start' }}>
            {saving ? 'Saving...' : isNewProfile ? 'Create profile' : 'Save cambios'}
          </Button>
        </Box>
      </Card>
    </PageShell>
  );
}
