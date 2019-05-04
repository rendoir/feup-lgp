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
      tags.push(state.value);
      setState({ tags });
  }
};

const handleRemove = (event) => {
  console.log(event.target);
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
    {
      state.tags.map((tag, idx) => (
            <div key={idx}>
              <Tag id={idx} value={tag} onRemove={handleRemove} />
            </div>
        )
      )
    }
</div>
```