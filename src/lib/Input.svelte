<script>
  export let value = null;
  export let name;
  export let placeholder = "Valeur";
  export { classNames as class };
  export let autofocus = false;

  let classNames = ''

  const handleAutofocus = (input) => {
    if (autofocus) {
      input.focus();
    }
  }

</script>
<div class="flex justify-center">
  <div class="mb-3 {classNames}">
    <input
      use:handleAutofocus
      type="text"
      name={name}
      bind:value
      placeholder={placeholder}
      class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
    />
  </div>
</div>