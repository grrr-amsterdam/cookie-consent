export const supportsLocalStorage = () => {
    const test = 'localstorage-test-key';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
};
