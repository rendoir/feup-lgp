Some icon imports:
```jsx static
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { apple, facebook } from "@fortawesome/free-brands-svg-icons";
```

As the ***index.tsx*** file already imports and adds all FAS and FAB Icons to the library, it is possible to use icons 
by simply writing the icon as a string, as of bellow:

```jsx static
<Icon icon="thumbs-up" />
```

Note that no 'fa' is prefixed to the string. That is because *fas* prefix is being inferred as the default. To use any 
brand icon it is necessary to indicate the prefix as such:

```jsx static
<Icon icon={['fab', 'apple']} />
```

A list with the fontawesome icons is available [here](https://fontawesome.com/icons?d=gallery).

Basic solid Icons:
```jsx
import * as icon from "@fortawesome/free-solid-svg-icons";

<div>
    <Icon icon={icon.faThumbsUp} />
    <Icon icon={icon.faThumbsDown} />
    <Icon icon={icon.faEnvelope} />
   
</div>
```

Basic brand Icons:
```jsx
import * as icon from "@fortawesome/free-brands-svg-icons";

<div>
    <Icon icon={icon.faTwitter} />
    <Icon icon={icon.faFacebook} />
    <Icon icon={icon.faApple} />
</div>
```

Themed Icons:
```jsx
import { faUser } from "@fortawesome/free-solid-svg-icons";

<div>
    <Icon icon={faUser} theme='default' />
    <Icon icon={faUser} theme='primary' />
    <Icon icon={faUser} theme='success' />
    <Icon icon={faUser} theme='danger' />
    <Icon icon={faUser} theme='info' />
    <Icon icon={faUser} theme='warning' />
</div>
```

Sizable Icons:
```jsx
import { faUser } from "@fortawesome/free-solid-svg-icons";

<div>
    <Icon icon={faUser} size='xs'/>
    <Icon icon={faUser} size='sm' />
    <Icon icon={faUser} size='1x' />
    <Icon icon={faUser} size='lg' />
    <Icon icon={faUser} size='2x' />
    <Icon icon={faUser} size='3x' />
    <Icon icon={faUser} size='4x' />
    <Icon icon={faUser} size='5x' />
    <Icon icon={faUser} size='6x' />
    <Icon icon={faUser} size='7x' />
    <Icon icon={faUser} size='8x' />
    <Icon icon={faUser} size='9x' />
    <Icon icon={faUser} size='10x' />
</div>
```

Pulsing and Spinning Icons:
```jsx
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

<div>
    <Icon icon={faSpinner} size='2x' theme='primary' pulse />
    <Icon icon={faSpinner} size='2x' theme='primary' spin  />
</div>
```

Inverted Icon:
```jsx
import { faUser } from "@fortawesome/free-solid-svg-icons";

<div>
    <Icon icon={faUser} theme='default' inverse />
    <Icon icon={faUser} theme='primary' inverse />
    <Icon icon={faUser} theme='success' inverse />
    <Icon icon={faUser} theme='danger' inverse />
    <Icon icon={faUser} theme='info' inverse />
    <Icon icon={faUser} theme='warning' inverse />
</div>
```

List Icons:  
By setting the *listItem* attribute, the list bullets are replaced by the specified icon
List Icons:  
```jsx
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";

<div>
    <p>Unordered List</p>
    <ul className='fa-ul'>
        <li><Icon icon={ faCheckSquare } listItem />Task 1</li>
        <li><Icon icon={ faCheckSquare } listItem />Task 2</li>
        <li><Icon icon={ faCheckSquare } listItem />Task 3</li>
        <li><Icon icon={ faSquare } listItem />Task 4</li>
        <li><Icon icon={ faSquare } listItem />Task 5</li>
        <li><Icon icon={ faSquare } listItem />Task 6</li>
    </ul>
    <hr />
    <p>Ordered List</p>
    <ol className='fa-ul'>
        <li><Icon icon={ faCheckSquare } listItem />Task 1</li>
        <li><Icon icon={ faCheckSquare } listItem />Task 2</li>
        <li><Icon icon={ faCheckSquare } listItem />Task 3</li>
        <li><Icon icon={ faSquare } listItem />Task 4</li>
        <li><Icon icon={ faSquare } listItem />Task 5</li>
        <li><Icon icon={ faSquare } listItem />Task 6</li>
    </ol>
</div>
```

Rotating Icons:
```jsx
import { faApple } from "@fortawesome/free-brands-svg-icons";
<div>
    <Icon icon={ faApple } size='2x' />
    <Icon icon={ faApple } size='2x' rotation={90} />
    <Icon icon={ faApple } size='2x' rotation={180} />
    <Icon icon={ faApple } size='2x' rotation={270} />
</div>
```

Flipping Icon:
```jsx
import { faApple } from "@fortawesome/free-brands-svg-icons";
<div>
    <Icon icon={ faApple } size='2x' />
    <Icon icon={ faApple } size='2x' flip='horizontal' />
    <Icon icon={ faApple } size='2x' flip='vertical' />
    <Icon icon={ faApple } size='2x' flip='both' />
</div>
```

Bordered Icon:
```jsx
import { faApple } from "@fortawesome/free-brands-svg-icons";
<div>
    <Icon icon={ faApple } size='2x' />
    <Icon icon={ faApple } size='2x' border />
</div>
```

Pull Icon to left or right:
```jsx
import { faApple } from "@fortawesome/free-brands-svg-icons";
<div>
    <Icon icon={ faApple } size='2x' pull='left' />
    <Icon icon={ faApple } size='2x' pull='right' />
</div>
```

Transforming operations:  
Available power transformation options are:  
- grow-#, shrink-#, up-#, down-#, left-#, right-#, with # ranging from 1 to 16em;  
- rotate-#, with # in degrees with negative numbers allowed;  
- flip-v and flip-h.
```jsx
import { faApple } from "@fortawesome/free-brands-svg-icons";
<div>
    <Icon icon={ faApple } size='2x' transform='shrink-6 left-4' />
    <Icon icon={ faApple } size='2x' transform='grow-12 down-4' />
    <Icon icon={ faApple } size='2x' transform='flip-v rotate--30' />
    <Icon icon={ faApple } size='2x' transform={{ rotate: 42 }} />
</div>
```

Masking Icons:
```jsx
import { faUser, faCircle, faSquare } from "@fortawesome/free-solid-svg-icons";

<div>
    <Icon icon={ faUser } theme='primary' size='2x' mask={ faCircle } />
    <Icon icon={ faUser } theme='success' size='2x' mask={ faSquare } />
</div>
```

Symbol:  
**Note:** not working!

Layered Icons:
```jsx
import { faCheck, faSquare, faCalendar } from "@fortawesome/free-solid-svg-icons";

<span className='fa-layers fa-fw fa-2x'>
    <Icon icon={ faSquare } inverse />
    <Icon icon={ faCheck } />
</span>
```
