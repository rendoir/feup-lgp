```jsx harmony
import Button from '../Button/Button';
const initial = {
  isOpen: false,
  step: 'type',
  request: {
    type: 'post',
    title: '',
    shortname: '',
    about: '',
    avatar: undefined,
    privacy: 'public',
    video: '',
    file: '',
  },
};
initialState = initial;

const handleOpen = () => setState({ isOpen: true });
const handleClose = () => setState(initial);
const handleRequestChange = (request) => setState({ request });
const handleStepChange = (step) => setState({ step });
const handleSubmit = (request) => {
  console.log(request);
  setState(initial);
};

<div>
  <Button theme={'primary'} onClick={handleOpen}>
    Create New
  </Button>
  { state.isOpen ? (
      <CreateNewModalChallenge
        isOpen={state.isOpen}
        step={state.step}
        request={state.request}
        shortnamePrefix={''}
        onClose={handleClose}
        maxGroupSize={4}
        onRequestChange={handleRequestChande}
        onStepChange={handleStepChange}
        onSubmit={handleSubmit}
      />
    ) : null }
</div>
```