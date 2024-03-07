const toggleDialogVisibility = (dialogElement) => {
  return {
    show: () => {
      dialogElement.setAttribute("aria-hidden", "false");
    },
    hide: () => dialogElement.setAttribute("aria-hidden", "true"),
  };
};

export default toggleDialogVisibility;
