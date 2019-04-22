Basic Select
```jsx harmony
initialState = {
  value: 'user',
  options: [
    {
      value: 'user', title: 'User'
    },
    {
      value: 'group', title: 'Group'
    }
  ]
};

<Select
  name='select_default'
  id='select_default'
  onChange={(value) => setState({ value })}
  value={state.value}
  placeholder='Basic Select'
  options={state.options}
/>
```

Small Select
```jsx harmony
initialState = {
  value: 'user',
  options: [
    {
      value: 'user', title: 'User'
    },
    {
      value: 'group', title: 'Group'
    }
  ]
};

<Select
  name='select_default'
  id='select_default'
  onChange={(value) => setState({ value })}
  value={state.value}
  placeholder='Basic Select'
  options={state.options}
  size='small'
/>
```

Disabled Select
```jsx harmony
initialState = {
  value: 'user',
  options: [
    {
      value: 'user', title: 'User'
    },
    {
      value: 'group', title: 'Group'
    }
  ]
};

<Select
  name='select_disabled'
  id='select_disabled'
  disabled
  onChange={(value) => setState({ value })}
  value={state.value}
  options={state.options}
/>
```

Select with label
```jsx harmony
const options = [{
  value: 'user', title: 'User'
  }, {
  value: 'group', title: 'Group'
}];

<Select
  name='select_labeled'
  id='select_labeled'
  label='Select type'
  onChange={(value) => setState({ value })}
  value={state.value}
  options={options}
/>
```

Themable Select
```jsx harmony
const options = [{
  value: 'default', title: 'Default theme'
}, {
  value: 'primary', title: 'Primary theme'
}, {
  value: 'success', title: 'Success theme'
}, {
  value: 'danger', title: 'Danger theme'
}, {
  value: 'info', title: 'Info theme'
}, {
  value: 'warning', title: 'Warning theme'
}];
const handleThemeChange = (theme) => setState({ value: theme });
initialState = {
  value: 'default'
};

<Select
  name='select_colored'
  id='select_colored'
  label='Select theme'
  onChange={handleThemeChange}
  value={state.value}
  options={options}
  theme={state.value}
/>
```