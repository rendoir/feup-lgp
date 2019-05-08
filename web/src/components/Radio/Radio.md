Basic Radio
```jsx harmony
const RadioGroup = require('./RadioGroup').default;

initialState = { value: 'group' };
const handleChange = (value) => setState({ value });

<div>
  <h3>Current value: { state.value }</h3>
  <hr />
  <RadioGroup onChange={handleChange} value={state.value}>
    <Radio value={'group'} />
    <Radio value={'channel'} />
  </RadioGroup>
</div>
```

Radio with labeled content as children:
```jsx harmony
const RadioGroup = require('./RadioGroup').default;

initialState = { value: 'group' }
const handleChange = (value) => setState({ value });

<RadioGroup onChange={handleChange} value={state.value}>
  <Radio value={'group'}>Group</Radio>
  <br />
  <Radio value={'channel'}>Channel</Radio>
</RadioGroup>
```

Disabled Radio:
```jsx harmony
const RadioGroup = require('./RadioGroup').default;

initialState = { value: 'group' }
const handleChange = (value) => setState({ value });

<RadioGroup onChange={handleChange} value={state.value} disabled>
  <Radio value={'group'}>Group</Radio>
    <br />
    <Radio value={'channel'}>Channel</Radio>
</RadioGroup> 
```