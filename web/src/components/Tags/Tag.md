Basic Tag:
```jsx harmony
import InputNext from '../InputNext/InputNext';
import Button from '../Button/Button';

initialState = {
  value: '',
  tags: []
};

const handleSubmit = () => {
  if (state.value.length > 0) {
      const tags = state.tags;
      tags.length < 5 ? tags.push(state.value) : null;
      setState({ tags });
  }
};

const handleRemove = (tag, event) => {
  const tags = state.tags;
  
  for(let j = 0; j < tags.length; j++) {
    if (tags[j] === tag) {
      tags.splice(j, 1);
      break;
    }
  }
  setState({ tags });
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
      Add Tag
    </Button>
    <div style={{ marginTop: '20px' }}>
    {
      state.tags.map((tag, idx) => (
            <div key={idx} style={{ padding: '3px 0' }}>
              <Tag id={idx} value={tag} onRemove={handleRemove} />
            </div>
        )
      )
    }
    </div>
</div>
```