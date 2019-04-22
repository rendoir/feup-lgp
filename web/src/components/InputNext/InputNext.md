Basic InputNext:
```jsx
<InputNext
  id="input_next_basic"
  label="Basic"
  placeholder="Basic placeholder"
  value={state.value || ''}
  onChange={(value) => setState({ value })}
/>
```

InputNext without label:
```jsx
<InputNext
  id="input_next_no_label"
  value={state.value || ''}
  placeholder="Basic placeholder"
  onChange={(value) => setState({ value })}
/>
```

Disabled Input:
```jsx
<InputNext
  disabled
  id="input_next_disabled"
  label="Disabled"
  value="Disabled InputNext"
/>
```

Success Input with hint:
```jsx
<InputNext
  hint="Correct email"
  id="input_next_success_hint"
  type="email"
  label="Email"
  onChange={(value) => setState({ value })}
  status="success"
  value={state.value || 'johndoe@example.com'}
/>
```

Error Input with hint:
```jsx
<InputNext
  hint="Incorrect email"
  id="input_next_error_hint"
  type="email"
  label="Email"
  onChange={(value) => setState({ value })}
  status="error"
  value={state.value || 'johndoe@example.com'}
/>
```

Prefixed Input
```jsx
<InputNext
  id="input_next_prefixed"
  label="Git URL"
  onChange={value => setState({ value })}
  placeholder="my_repo"
  prefix="git.fe.up.pt/"
  value={state.value || ''}
/>
```

Textarea InputNext:
```jsx
<InputNext
  id="input_next_textarea"
  type="textarea"
  label="Bio"
  placeholder="Write something about yourself"
  value={state.value || ''}
  onChange={(value) => setState({ value })}
/>
```

Input with maxLength:
```jsx
<InputNext
  id="input_next_maxLenght"
  type="textarea"
  label="About"
  maxLength={20}
  placeholder="Type something"
  value={state.value || ''}
  onChange={(value) => setState({ value })}
/>
```

Larger InputNext:
```jsx
<InputNext
  id="input_next_large"
  label="Large InputNext"
  value={state.value || ''}
  placeholder="Large placeholder"
  large
  onChange={(value) => setState({ value })}
/>
```