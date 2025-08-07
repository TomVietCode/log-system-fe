export const inputStyle = {
  marginBottom: '8px',
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    bottom: '-20px',
    minHeight: '20px'
  },
  '& .MuiInputBase-root': {
    height: '56px'
  }
}

export const profileInputStyle = {
  ...inputStyle,
  '& .MuiInputBase-root': {
    height: '40px'
  }
};