function validatePhone(phone = '') {
    return /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phone);
}

export default validatePhone;