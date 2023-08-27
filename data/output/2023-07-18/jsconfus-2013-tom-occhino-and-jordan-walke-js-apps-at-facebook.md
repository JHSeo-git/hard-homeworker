저는 톰 오키노입니다. 우선 크리스에게 감사드립니다. 페이스북에서 어떻게 자바스크립트 애플리케이션 개발을 하는지에 대해 조금 이야기하려고 합니다. 우리는 조금 다른 방식으로 할 것입니다. 조던도 실제로 발표를 할 예정입니다. 그는 기술적인 부분을 다룰 것이고, 저는 플러피한 것에 대해 이야기하려고 합니다. 일단 빠르게 진행하겠습니다. 먼저 우리는 자주 이 질문을 던집니다. 자바스크립트 애플리케이션을 어떻게 구조화해야 할까요? 특히 웹 브라우저에서 실행되는 자바스크립트 애플리케이션에 대해 더 구체적으로 이야기하려고 합니다. 우리는 노드를 사용하고 모든 재미있는 것들을 다루고 있습니다. 하지만 저는 사용자 인터페이스 쪽에 더 관심이 있습니다. 그래서 오늘은 그에 대해 이야기하려고 합니다. 이 질문에 대답하기 위해 많은 자바스크립트 프레임워크가 있습니다. 이러한 프레임워크들은 웹을 실제 애플리케이션 플랫폼으로 발전시키는 데 도움이 되었습니다. Peter Higgins가 여기에 있다면, Dojo가 이미 이를 해냈다는 것을 언급하고 싶습니다. Dojo가 이미 그렇게 했습니다. 하지만 합의는 기본적으로 MVC 스타일 아키텍처가 가장 좋다는 것입니다. 그리고 그것은 단지 MVC가 아니라 MVVM이거나 Angular에서는 모델 뷰 뭐시기라고 부르는 것입니다. 저는 그것을 정말 좋아합니다. 실제로 저는 선언적 데이터 바인딩을 사용하는 Angular를 정말 좋아합니다. API 측면에서는 그것이 종말의 성지라고 생각합니다. 하지만 이러한 모든 아키텍처와 프레임워크에는 한 가지 공통점이 있습니다. 그리고 그것은 모델입니다. 일반적으로 이러한 프레임워크에서 모델은 이벤트 API 내에서 관찰 가능한 객체를 구현합니다. 개발자들은 양방향 데이터 바인딩을 사용하여 뷰를 모델에 바인딩합니다. 모델이 변경되면 뷰도 업데이트될 수 있고, 뷰가 변경되면 모델도 업데이트될 수 있으며, 이는 다른 뷰로 전파됩니다. 실례를 들어서 죄송합니다. 이 관찰 가능한 모델 패턴은 변이를 장려합니다. 그리고 변이는 복잡합니다. 몇 년 전에, 채팅 재작성을 시작으로 우리는 애플리케이션을 조금 다르게 구조화하려고 시도했습니다. 개발자들이 다루어야 하는 변이의 양을 최소화하고자 했습니다. 변이는 필요한 악입니다. 다루어야 합니다. 하지만 개발자들이 직접 코드를 작성해야 하는 변이의 양을 최소화하고자 했습니다. 이것이 무슨 의미인지 보여드리겠습니다. 간단한 애플리케이션의 구조는 다음과 같습니다. 이 다이어그램에서 모든 업데이트가 단일 흐름을 통해 이루어짐을 알 수 있습니다. 사용자 입력을 포함한 모든 업데이트는 단일 채널을 통해 이루어집니다. 이것은 단방향 데이터 바인딩입니다. 이러한 업데이트는 결국 뷰에 도달합니다. 우리가 찾은 가장 간단한 방법은 변이를 완전히 피하는 것입니다. 즉, 데이터가 변경될 때마다 뷰를 완전히 삭제하고 처음부터 다시 렌더링하는 것입니다. 이제 당신은 생각할 것입니다. 그렇게 하면 안 될 것입니다. DOM은 느릴 수 있습니다. 브라우저는 그것을 수행하는 데 많은 비용이 들 것입니다. 모든 것이 변경될 때마다 HTML을 다시 상호작용하는 것은 현실적으로 불가능합니다. 개념적으로는 우리가 원하는 것입니다. 우리는 모든 이벤트마다 처음부터 다시 렌더링하는 개념적인 간결함을 가진 것을 구축하고 싶습니다. 하지만 오버헤드는 없어야 합니다. 그것은 현실적으로 불가능합니다. 약 18개월에서 2년 전쯤, 정확한 날짜를 기억하지 못하고 시작했습니다. 우리는 이를 도와주는 자바스크립트 라이브러리를 개발하기 시작했고, 우리는 그것을 리액트라고 부릅니다. 이것이 모든 플러피한 것이었습니다. 이제 조던에게 기술적인 세부 사항에 대해 이야기하게 할 것입니다. 여기 있습니다. 감사합니다. 좋아요. 톰이 말한 대로, 우리가 컴포넌트 프레임워크를 구축할 때 노출되는 개발자가 직면하는 변이의 양을 최소화하려는 것이 우리의 목표 중 하나입니다. 그래서 리액트는 몇 가지 다른 방식으로 다른 접근 방식을 취합니다. 첫 번째는 매우 선언적이라는 것입니다. 그래서, 그것은 초기 렌더링뿐만 아니라 많은 업데이트도 어떤 종류의 선언을 통해 구현됩니다. 그것은 UI가 어떻게 보여야 하는지에 대한 비변적인 설명입니다. 좋습니다. 그래서 우리는 React 내에서 관찰 가능한 데이터 바인딩을 가지고 있지 않습니다. 우리는 그것과 함께 제공하지 않습니다. 실제로 React를 사용하여 그것을 사용할 수 있을 것입니다. 그러나 React를 사용하여 구현할 수 있는 관찰 가능한 데이터 바인딩을 위해 도달할 수 있는 많은 것들이 있습니다. 그리고 선언은 우리가 그것을 하는 방법입니다. React와 함께 우리는 임베디드 XML 구문을 제공합니다. 그리고 우리는 그것을 JSX라고 부릅니다. 이것은 과거에 일어난 많은 언어 제안 작업과 유사합니다. 하지만 우리는 몇 가지 다른 점이 있습니다. 그리고 먼저 어떻게 보이는지 살펴보세요. 좋습니다. 여기에서 우리는 JSX와 함께 React를 사용합니다. 그래서 우리는 메시지 변수를 만들고 react-div 인스턴스에 할당합니다. 그리고 그 안에 중첩된 내부 div도 있습니다. 이 div들은 당신이 익숙한 것과는 조금 다릅니다. 그것들은 DOM 노드가 아닌 특별한 react-divs입니다. 그것이 중요한 이유에 대해 설명하겠습니다. 맨 아래에서 렌더링합니다. JSX를 유일한 변환으로 사용하는 것이 JSX의 독특한 점입니다. 우리는 이러한 태그를 함수 호출로 변환하는 것뿐입니다. 그래서 보기는 그리 좋지 않을 수 있지만, 줄 번호도 보존됩니다. 그래서 이것을 린터에 전달하면 범위를 벗어난 태그를 잡아낼 수 있습니다. 메시지는 올바른 줄에 표시되고 모든 도구가 중요합니다. 하지만 JSX는 React와 함께 사용할 수 있는 선택적인 것입니다. 이것을 좋아한다면 이렇게 작성할 수 있습니다. 하지만 여러분은 동의하실 것 같습니다. 이것이 훨씬 더 좋습니다. React는 DOM 노드와 DOM 컴포넌트 이상입니다. React는 주로 재사용 가능한 코드를 추상화하고 응용 프로그램 UI의 구현 세부 사항을 숨기는 방법입니다. React의 주요 초점은 사용자 정의 컴포넌트를 구축할 수 있도록 하는 것입니다. 사용자 정의 컴포넌트를 사용하는 방법은 div나 span을 사용하는 방법과 매우 유사합니다. 우리는 xml 구문을 사용할 수 있습니다. JSX를 사용하여 인스턴스화합니다. 여기에는 xml 속성, 텍스트 및 OnAction 콜백이 제공되며, 이들은 뷰 인스턴스 또는 React 컴포넌트 인스턴스의 속성이 됩니다. 이 Action button을 어떻게 구현하거나 정의하는지 확인해야 할 것입니다. 알아두어야 할 몇 가지 사항은 React.createClass를 호출하고 렌더 함수를 제공하는 것입니다. 이렇게 하면 컴포넌트를 모델링하는 클래스가 생성되고 React 기본 기능이 모두 확장되거나 혼합됩니다. React는 객체 지향에 중점을 두는 프레임워크가 아닙니다. JavaScript가 자연스럽게 수행할 수 있는 것에 자연스럽게 적합하기 때문에 약간의 상속을 사용합니다. 그러나 핵심 패러다임은 객체 지향이 아니므로 그것을 언급하고 프로토 타입에 혼합될 다른 메서드를 제공할 수 있습니다. 그래서 Action button을 정의한 순간부터 실제로 참조할 수 있습니다. 범위 내에 있으며, 린터가 불평하지 않을 것입니다. Action button이 범위 내에 없다면, 린터가 "정의되지 않았다"고 말할 것입니다. JSX는 JavaScript 중심의 언어이므로 매우 JavaScript 중심의 언어입니다. 그래서 렌더에는 하나의 목적이 있으며, 그것은 언제든지 뷰를 설명하는 것입니다. 초기 렌더링뿐만 아니라 언제든지 뷰를 설명하는 것입니다. 연속적인 업데이트를 통해 어떻게 보일 수 있는지 살펴보겠습니다. 좋습니다. 여기에서 우리는 쉘로 시작합니다. 외부 버튼과 내부 스팬이 있습니다. 그래서 우리는 주어진 속성을 흥미로운 방식으로 사용하려고 합니다. 이를 사용자 경험으로 해석할 수 있도록 하려면, 텍스트 속성을 가져와 내부 스팬으로 라우팅해야 합니다. 그리고 그것을 수행하는 방법은 이 도트 props를 통해 전달된 xml 속성을 참조할 수 있기 때문입니다. 그래서 우리는 중앙에서 book flight 텍스트를 내부 스팬으로 라우팅하고 있습니다. 하지만 이 xml 속성은 문자열일 필요는 없습니다. 우리는 JavaScript에 있으며, JSX와 React는 JavaScript에 중점을 둡니다. 그래서 여기에 제공되는 on action 콜백에는 함수가 있고, 우리는 그것을 버튼의 on click에 라우팅하고 있습니다. ActionButtons on action은 이 경우 DOM 버튼의 on click입니다. 그래서 이것은 최소한의 DOM 변이를 만들기 위해 이 노력을 하는 것입니다. 다시 말해서, React 컴포넌트는 이러한 속성을 사용자 경험으로 변환하는 변환기로 생각할 수 있으며, 이러한 속성이 올바른 위치로 라우팅되는 것을 상상할 수 있습니다. 하지만 React는 라우팅 도구 이상입니다. 이 보간 중괄호 내에서 원하는 어떤 JavaScript 식도 수행할 수 있습니다. 그래서 텍스트가 변경될 때마다 항상 대문자로 변환됩니다. 앞서 언급한 대로 렌더는 초기 렌더링뿐만 아니라 언제든지 렌더링하는 것입니다. 그래서 속성이 변경되거나 상태가 변경되면 렌더 출력이 변경되고 React는 렌더 함수를 만족시킵니다. React는 UI가 언제나 설명한 대로 렌더링되도록 하기 위해 필요한 최소한의 DOM 변이를 찾아냅니다. 예를 들어 텍스트가 변경된 경우, React는 내부 스팬의 텍스트 내용만 변경해야 함을 찾아냅니다. 실제로 DOM에서 읽지 않습니다. 좋습니다. 컨퍼런스에서 발표하는 사람은 가장 인위적인 예제를 보여줄 것입니다. React도 마찬가지이지만, React 시스템에서 탈출구 또는 여러 가지 탈출구를 활용할 수 있습니다. 하고 싶은 몇 가지 일은 기존 프레임워크나 기존 코드와 통합하려는 것입니다. 우리는 여러분이 그렇게 할 수 있도록 많은 방법을 제공하고 있으며, 우리가 가지고 있는 더 흥미로운 탈출구 중 하나는 이 프로세스를 도와주는 것입니다. React는 가장 작은 차이를 찾기 위해 최소한의 검색 공간을 제거하고 React를 안내하는 데 도움을 줄 수 있도록 허용합니다. 이것들은 완전히 선택적입니다. 코드에 넣을 수도 있고 빼도 됩니다. 동일한 애플리케이션이 더 빠르거나 느릴 뿐입니다. 이 최적화 단계를 개발의 완전히 별개의 부분으로 다루고 있습니다. 핵심이 아닙니다. 최적화로 시작하지 않고 병목 현상을 식별하고 필요한 곳에 적용합니다. 좋습니다. 이제 다시 톰에게 돌려주고 React의 역사와 미래에 대해 알려줄 것입니다. 감사합니다, 조던. 이 탈출구는 제품을 시간이 지남에 따라 반복할 수 있는 데 매우 중요합니다. 그래서 다른 탈출구 중 하나는 사실상 언제든지 DOM 노드를 가져와서 JavaScript를 작성할 수 있도록 하는 것입니다. 우리가 여기에 보여준 예제 중 하나는, 내용을 줄였지만, 이렇게 말할 수 있습니다. "다른 프레임워크에서 가져온 다른 플러그인이 있고, 그것이 자동으로 크기가 조정되는 텍스트 영역이나 자동 완성기와 같은 것이라면, 이러한 것들을 그 탈출구를 통해 쉽게 연결할 수 있습니다. 이것이 사실상 Facebook에서 이 프레임워크가 성공적이었던 이유입니다. 우리는 모든 것을 변환할 필요가 없었습니다. 조금씩 사용할 수 있었습니다. 그리고 그렇게 하기 위해 우리는 React와 빌드 단계, 그리고 그 뒤에 있는 모든 도구를 검토하고 재구성하고 다시 구축했습니다. 그래서 Instagram이 Facebook에 합류한 것은 우리에게 처음으로 일어난 일이었습니다. Facebook의 인프라에 속하지 않은 다른 사람이 Facebook의 인프라를 사용하고 싶어했습니다. 그리고 우리는 과거에 JSConf에서 많은 것을 발표했고, 역사적으로 우리의 변명은 어떤 것을 우리의 인프라에서 분리하는 것은 꽤 어렵다는 것이었습니다. 하지만 Instagram이 합류하면서 우리는 그들을 위해 이를 사용하고 싶어했습니다. 그리고 그들은 우리에게 강제로 작용했습니다. Rebecca가 언급한 것처럼 코드를 오픈 소스처럼 작성하십시오. 그래서 우리는 그냥 React와 빌드 단계, 그리고 그 뒤에 있는 모든 도구를 검토하고 재구성하고 다시 구축했습니다. 그래서 Instagram이 Instagram.com에서 이것을 사용할 수 있도록 했습니다. 실제로 Instagram.com은 그들이 Facebook에 합류한 후 처음으로 이 프로젝트를 수행하고 싶어했습니다. 그리고 1주일 또는 2주 안에 그들은 Instagram.com 프로필을 이 시스템에서 구축했습니다. 그것은 우리에게 놀라운 일이었습니다. 우리는 그것에 대해 정말로 흥분했습니다. 그들은 사실상 외부 클라이언트로서의 실제 연습을 제공했습니다. 이 프로젝트에서 일하고 있는 모든 사람들에게는 다음 단계가 있습니다. 우리는 이것을 오픈 소스로 공개하고 싶습니다. 그리고 우연히도, 방금 30분 전에 그것을 공개했습니다. Facebook을 확인해보세요. 감사합니다. 다시 말하지만, 저희는 그냥 사용하고 있는 것입니다. 우리에게는 아주 잘 작동하는 것입니다. 가능한 한 많은 피드백을 받고 싶어합니다. 링크를 확인해보세요. 우리는 피드백에 대해 매우 열려 있습니다. 구글 그룹, IRC 채팅방, GitHub에서 이슈 등이 있습니다. 이것이 React이고 감사합니다.