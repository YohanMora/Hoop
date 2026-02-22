export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "El correo electronico no puede quedar vacio."
  if (!re.test(email)) return 'Ooops! Necesitas un correo electronico valido.'
  return ''
}
