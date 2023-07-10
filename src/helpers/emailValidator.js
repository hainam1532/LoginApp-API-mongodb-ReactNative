export function emailValidator(email) {
    const re = /\S+@\S+\.\S+/
    if(!email) return "Email không được để trống"
    if (!re.test(email)) return 'Nhập địa chỉ email hợp lệ'
    return ''
}