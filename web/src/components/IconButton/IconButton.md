Basic IconButton:

```jsx
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
<div className="styleguide__buttons">
  <IconButton glyph={faThumbsUp} onClick={() => alert('Clicked')} />
  <IconButton glyph={faThumbsDown} onClick={() => alert('Clicked')} />
</div>
```

IconButton sizes:
```jsx
import { faApple, faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
<div className="styleguide__buttons">
  <IconButton glyph={faApple} size="small" onClick={() => alert('Clicked')} />
  <IconButton glyph={faFacebook} size="normal" onClick={() => alert('Clicked')} />
  <IconButton glyph={faTwitter} size="large" onClick={() => alert('Clicked')} />
</div>
```

Flat Themed IconButton:
```jsx
import { faUserMd } from "@fortawesome/free-solid-svg-icons";
<div className="styleguide__buttons">
  <IconButton glyph={ faUserMd } size="small" onClick={() => {}} flat theme="default" />
  <IconButton glyph={ faUserMd } size="small" onClick={() => {}} flat theme="primary" />
  <IconButton glyph={ faUserMd } size="small" onClick={() => {}} flat theme="success" />
  <IconButton glyph={ faUserMd } size="small" onClick={() => {}} flat theme="danger" />
  <IconButton glyph={ faUserMd } size="small" onClick={() => {}} flat theme="info" />
  <IconButton glyph={ faUserMd } size="small" onClick={() => {}} flat theme="warning" />
  <br />
  <IconButton glyph={ faUserMd } size="normal" onClick={() => {}} flat theme="default" />
  <IconButton glyph={ faUserMd } size="normal" onClick={() => {}} flat theme="primary" />
  <IconButton glyph={ faUserMd } size="normal" onClick={() => {}} flat theme="success" />
  <IconButton glyph={ faUserMd } size="normal" onClick={() => {}} flat theme="danger" />
  <IconButton glyph={ faUserMd } size="normal" onClick={() => {}} flat theme="info" />
  <IconButton glyph={ faUserMd } size="normal" onClick={() => {}} flat theme="warning" />
  <br />
  <IconButton glyph={ faUserMd } size="large" onClick={() => {}} flat theme="default" />
  <IconButton glyph={ faUserMd } size="large" onClick={() => {}} flat theme="primary" />
  <IconButton glyph={ faUserMd } size="large" onClick={() => {}} flat theme="success" />
  <IconButton glyph={ faUserMd } size="large" onClick={() => {}} flat theme="danger" />
  <IconButton glyph={ faUserMd } size="large" onClick={() => {}} flat theme="info" />
  <IconButton glyph={ faUserMd } size="large" onClick={() => {}} flat theme="warning" />
</div>
```

Disabled IconButton:
```jsx
import { faReact } from "@fortawesome/free-brands-svg-icons";
<div className="styleguide__buttons">
  <IconButton glyph={ faReact } size="normal" disabled />
  <IconButton glyph={ faReact } size="large" disabled />
  <br />
  <IconButton glyph={ faReact } size="normal" flat disabled />
  <IconButton glyph={ faReact } size="large" flat disabled />
</div>
```