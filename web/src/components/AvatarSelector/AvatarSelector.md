```jsx harmony
initialState = {
  avatar: undefined,
  placeholder: 'empty',
  name: 'Daredevil',
};

const onChange = (avatar) => {
  setState({ avatar });
};

<AvatarSelector
  {...state}
  onChange={onChange}
  onRemove={() => setState({ avatar: undefined })}
  size={148}
/>
```;
