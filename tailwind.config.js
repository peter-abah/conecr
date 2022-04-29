function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  content: [
    './src/**/*.{js,ts,tsx,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: withOpacityValue('--color-primary'),
        bg: withOpacityValue('--color-bg'),
        text: withOpacityValue('--color-text'),
        meta: withOpacityValue('--color-meta'),
        'meta-light': withOpacityValue('--color-meta-light'),
        'msg-other': withOpacityValue('--color-msg-other'),
        'msg-user': withOpacityValue('--color-msg-user')
      }
    }
  },
  plugins: [],
}
