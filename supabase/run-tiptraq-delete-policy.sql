-- Allow patients to delete their own TipTraQ recordings
-- Run in Supabase SQL Editor if uploads delete with a permission error

drop policy if exists "Patients can delete own tiptraq nights" on public.tiptraq_nights;

create policy "Patients can delete own tiptraq nights"
  on public.tiptraq_nights for delete
  to authenticated
  using (auth.uid() = patient_id);

notify pgrst, 'reload schema';
