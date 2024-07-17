# 24-07-17 JPA 영속성 컨텍스트
영속성 컨텍스트(PersistenceContext)  
Entity를 영구 저장하는 환경이라는 뜻

* 눈에 보이지 않는 논리적 개념
* 애플리케이션과 DB 사이 객체를 보관하는 가상의 DB로 생각하기
* EntityManager를 통해 Entity를 영속성 컨텍스트에 보관, 관리