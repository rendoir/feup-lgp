Basic Input:
```jsx
<Input
    id="input_basic"
    label="Basic"
    placeholder="Basic placeholder"
    value={state.value || ''}
    onChange={(value) => setState({ value })}
/>
```

Input without label:
```jsx
<Input
    id="input_no_label"
    value={state.value || ''}
    placeholder="Basic placeholder"
    onChange={(value) => setState({ value })}
/>
```

Disabled Input:
```jsx
<Input
    disabled
    id="input_disabled"
    label="Disabled"
    value="Disabled Input"
/>
```

Success Input with hint:
```jsx
<Input
    hint="Correct email"
    id="input_success_hint"
    type="email"
    label="Email"
    onChange={(value) => setState({ value })}
    status="success"
    value={state.value || 'johndoe@example.com'}
/>
```

Error Input with hint:
```jsx
<Input
    hint="Incorrect email"
    id="input_error_hint"
    type="email"
    label="Email"
    onChange={(value) => setState({ value })}
    status="error"
    value={state.value || 'johndoe@example.com'}
/>
```

Prefixed Input:
```jsx
<Input
    id="input_prefixed"
    label="Git URL"
    onChange={(value) => setState({ value })}
    placeholder="my_repo"
    prefix="git.fe.up.pt/"
    value={state.value || ''}
/>
```

Textarea Input:
```jsx
<Input
    id="input_textarea"
    type="textarea"
    label="Bio"
    placeholder="Write something about yourself!"
    value={state.value || ''}
    onChange={(value) => setState({ value })}
/>
```

Larger Input:
```jsx
<Input
    id="input_large"
    label="Large Input"
    value={state.value || ''}
    placeholder="Large placeholder"
    large
    onChange={(value) => setState({ value })}
/>
```