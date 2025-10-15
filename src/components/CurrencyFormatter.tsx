export const NgnFn = (val: number) =>
  Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(val);