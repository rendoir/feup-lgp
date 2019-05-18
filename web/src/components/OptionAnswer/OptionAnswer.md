Basic Tag:
```jsx harmony
import InputNext from '../InputNext/InputNext';
import Button from '../Button/Button';

initialState = {
  value: '',
  options: []
};

const handleSubmit = () => {
  if (state.value.length > 0) {
      const options = state.options;
      options.length < 5 ? options.push(state.value) : null;
      setState({ options });
  }
};

const handleRemove = (tag, event) => {
  const options = state.options;
  
  for(let j = 0; j < options.length; j++) {
    if (options[j] === tag) {
      options.splice(j, 1);
      break;
    }
  }
  setState({ options });
};

<div>
    <InputNext
      value={state.value}
      onChange={value => setState({ value })}
      id={1}
    />
    <Button
      onClick={handleSubmit}
    >
      Add Option Answer
    </Button>
    <div style={{ marginTop: '20px' }}>
    {
      state.options.map((tag, idx) => (
            <div key={idx} style={{ padding: '3px 0' }}>
              <OptionAnswer id={idx} value={tag} onRemove={handleRemove} />
            </div>
        )
      )
    }
    </div>
</div>
```