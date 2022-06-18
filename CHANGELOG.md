# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/kaname-png/revoltx/compare/v1.6.1...v2.0.0) (2022-06-18)


### ⚠ BREAKING CHANGES

* Enabled typescript mode strict

* update deps ([169a98d](https://github.com/kaname-png/revoltx/commit/169a98d8fa4c19076afc8e416d751fd0cba6d954))

### [1.6.1](https://github.com/kaname-png/revoltx/compare/v1.6.0...v1.6.1) (2022-05-30)

## [1.6.0](https://github.com/kaname-png/revoltx/compare/v1.5.6...v1.6.0) (2022-05-09)


### Features

* bundle typescript types ([ffdfce7](https://github.com/kaname-png/revoltx/commit/ffdfce7556c197de9f997e8b3f95d149a46126b9))

### [1.5.6](https://github.com/kaname-png/revoltx/compare/v1.5.5...v1.5.6) (2022-05-09)


### Bug Fixes

* export listener types ([7781c7b](https://github.com/kaname-png/revoltx/commit/7781c7bfd040733fa0b0bfa6406d97d09692a13c))

### [1.5.5](https://github.com/kaname-png/revoltx/compare/v1.5.4...v1.5.5) (2022-05-09)


### Bug Fixes

* **commands:** commandParse event called incorrectly and the command context parameter was added ([e75edf6](https://github.com/kaname-png/revoltx/commit/e75edf6d8ccb1f4f5abbfbd5dfa6e465e6ff9bb2))

### [1.5.4](https://github.com/kaname-png/revoltx/compare/v1.5.3...v1.5.4) (2022-05-08)


### Bug Fixes

* **listeners:** get ws ping data ([1a59877](https://github.com/kaname-png/revoltx/commit/1a59877fba577d2d2a9aea2cf98c37fa74fa287f))

### [1.5.3](https://github.com/kaname-png/revoltx/compare/v1.5.2...v1.5.3) (2022-05-08)


### Bug Fixes

* **client:** error register stores default paths ([5188488](https://github.com/kaname-png/revoltx/commit/5188488b4db48f8e6d8bdc8478feb9a0dd4107ec))

### [1.5.2](https://github.com/kaname-png/revoltx/compare/v1.5.1...v1.5.2) (2022-05-08)


### Bug Fixes

* **utils:** hmr not enabled by default ([f6f035e](https://github.com/kaname-png/revoltx/commit/f6f035e5830aeefa1b95ab0d681619b9de2d0a7b))

### [1.5.1](https://github.com/kaname-png/revoltx/compare/v1.5.0...v1.5.1) (2022-05-08)


### Bug Fixes

* **utils:** hmr not enabled by default ([2c5255e](https://github.com/kaname-png/revoltx/commit/2c5255e9457d6062b46690215e8035ceb50558e2))

## [1.5.0](https://github.com/kaname-png/revoltx/compare/v1.4.1...v1.5.0) (2022-05-08)


### Features

* **client:** date on which the bot was marked as ready ([04aa359](https://github.com/kaname-png/revoltx/commit/04aa35999e3981c9719c2644d31439fec6e393f8))
* **client:** updated revolt events ([53f0c6f](https://github.com/kaname-png/revoltx/commit/53f0c6fd24a4efc5501a9fd5eb0985e9d985dca8))
* **commands:** now in revolt.js the channel and server permissions are unified ([9d6b837](https://github.com/kaname-png/revoltx/commit/9d6b837c013d7d5f9964e55136527057214b4f30))
* **commands:** rework base listeners ([db88e7b](https://github.com/kaname-png/revoltx/commit/db88e7b5bc75d24e5291d27fcd113b71f505664d))
* export more types, utils and classes ([2612d55](https://github.com/kaname-png/revoltx/commit/2612d55a3d655155268dcff949e409ee3c59b3e6))
* now baseUserDirectory is optional and update readme ([cf84713](https://github.com/kaname-png/revoltx/commit/cf847130f8112867e88e110a7f974e2efbf5fdbd))
* **preconditions:** improve permissions calculate for client/user permissions ([247a5d7](https://github.com/kaname-png/revoltx/commit/247a5d78e1fc06dd37350c4ad43c265b88b842d6))
* refactor small code to new revolt.js package version ([7c9e1bf](https://github.com/kaname-png/revoltx/commit/7c9e1bf86694528f6c91c806e37c992da8086a96))


### Bug Fixes

* **client:** options of hmr not resolved ([712ece8](https://github.com/kaname-png/revoltx/commit/712ece816dd9b4c9854b3291b584ca7ce10b2a87))
* **commands:** minor fixes in command options ([c81c641](https://github.com/kaname-png/revoltx/commit/c81c641b42e3ae4f9715a829a000b58cbda3dd1d))
* **deps:** update sapphire dependencies ([381dcca](https://github.com/kaname-png/revoltx/commit/381dcca8386df72904b7f010ab7e9771734442fc))
* **permissions:** default permissions for dm channels ([68e8727](https://github.com/kaname-png/revoltx/commit/68e872742e484915e7842a89e55fcb9740ebb8dc))
* types ([d47cd03](https://github.com/kaname-png/revoltx/commit/d47cd03931b34cad21415d0d769448e7205c4e27))
* updated with latest revolt features ([38f695d](https://github.com/kaname-png/revoltx/commit/38f695d51221e1349392f6e508fba4784f7945a3))

### [1.4.1](https://github.com/kaname-png/revoltx/compare/v1.4.0...v1.4.1) (2022-03-09)

## [1.4.0](https://github.com/kaname-png/revoltx/compare/v1.3.0...v1.4.0) (2022-03-09)


### Features

* **commands:** prefix per-server ([d2af1f7](https://github.com/kaname-png/revoltx/commit/d2af1f726e48911750080542915d05f539bf6326))
* **core:** added hmr ([e0117bb](https://github.com/kaname-png/revoltx/commit/e0117bb2f3c796ea25c4ac1661daa2d12c563a7d))

## [1.3.0](https://github.com/kaname-png/revoltx/compare/v1.2.0...v1.3.0) (2022-03-09)

### Features

-   **client:** logger ([4df3800](https://github.com/kaname-png/revoltx/commit/4df3800b88ee2c7de5802a891452cd12fc6278e4))

## [1.2.0](https://github.com/kaname-png/revoltx/compare/v1.1.3...v1.2.0) (2022-03-08)

### Features

-   **commands:** permissions manager ([aed15d7](https://github.com/kaname-png/revoltx/commit/aed15d769ed75193162953d111c3c40f5142a117))
-   **core:** added @sapphire/framework preconditions system ([1fc4d37](https://github.com/kaname-png/revoltx/commit/1fc4d370d6c8024449228033133ab73feb1ded7c))
-   **core:** permission manager ([873e3ca](https://github.com/kaname-png/revoltx/commit/873e3ca9e7c114af8e1514c6ecaf7446366ff6e4))
-   **core:** permissions manager ([c51a268](https://github.com/kaname-png/revoltx/commit/c51a2686790eebdc0868f34983c545545f1a0afd))
-   **preconditions:** added cooldown precondition ([64e9aa6](https://github.com/kaname-png/revoltx/commit/64e9aa65f3e1c2bee1f115937958d6532577ac17))
-   **preconditions:** added runIn preconditions for commands ([d19bd6c](https://github.com/kaname-png/revoltx/commit/d19bd6c548c6d79a990705515e8d7ddb4bfb468a))

### Bug Fixes

-   **preconditions:** identifiers ([8fbea22](https://github.com/kaname-png/revoltx/commit/8fbea22cd853f801cb8de5a3c6defc6f15b021c8))

### [1.1.3](https://github.com/kaname-png/revoltx/compare/v1.1.2...v1.1.3) (2022-03-07)

### Bug Fixes

-   **client:** required baseDirectory option ([4991f80](https://github.com/kaname-png/revoltx/commit/4991f80d9d53ee1ce0ab82273f1dea6f38c46c4a))

### [1.1.2](https://github.com/kaname-png/revoltx/compare/v1.1.1...v1.1.2) (2022-03-07)

### [1.1.1](https://github.com/kaname-png/revoltx/compare/v1.1.0...v1.1.1) (2022-03-07)

### Bug Fixes

-   readme ([147f3c9](https://github.com/kaname-png/revoltx/commit/147f3c9f636472f3998a58e5019f9a8a9f636c9e))

## 1.1.0 (2022-03-07)

### Features

-   added readme and licenses ([69acdba](https://github.com/kaname-png/revoltx/commit/69acdba242a05fc53c7abaa19aa54667ef6d8d4b))
-   **arguments:** added enum arg ([998ab9c](https://github.com/kaname-png/revoltx/commit/998ab9c3877b39167059b193aef15f283e6a2dbe))
-   **arguments:** added revolt args ([9afaee6](https://github.com/kaname-png/revoltx/commit/9afaee6e0e93901290dab204fdd2485b113f6747))
-   **arguments:** args for general types ([a51aea2](https://github.com/kaname-png/revoltx/commit/a51aea2c48ab4eba5eed2b31bb244a2ce75ffd3c))
-   **arguments:** channel types arguments ([cde7a52](https://github.com/kaname-png/revoltx/commit/cde7a52ab18d1d9cbd920816f6e61e4654b0f005))
-   **ci:** habilitado publicaciones a next ([cf87974](https://github.com/kaname-png/revoltx/commit/cf879744cd3c89b02c1550ebe8ff9ad752ec62c4))
-   client and listener store ([4c1c2ec](https://github.com/kaname-png/revoltx/commit/4c1c2ec63db0629565b073d0f9bff761d341063b))
-   **client:** piece scan directory ([e514aac](https://github.com/kaname-png/revoltx/commit/e514aac14afa89bba0d5e2535a39a0978906088b))
-   **client:** return client in login method ([b4a9cfe](https://github.com/kaname-png/revoltx/commit/b4a9cfe680188df72ec2b59c9e6a860633a9df94))
-   **commands:** auto assign category ([8426fec](https://github.com/kaname-png/revoltx/commit/8426fec82525cf75bc82ffc455f119e3959af5fe))
-   **core:** added @sapphire/framework args system ([4830cf4](https://github.com/kaname-png/revoltx/commit/4830cf4a780d89923259c163cf9ac31119ab6904))
-   **core:** added commands store ([ba5837c](https://github.com/kaname-png/revoltx/commit/ba5837c3ac6e2a386a50aa811b485259c4c12374))
-   **core:** export Command and Listener structure ([3af5847](https://github.com/kaname-png/revoltx/commit/3af58477b6033a5283f6c29dbe420abfcc0fdd26))
-   **core:** exports resolvers ([999fc40](https://github.com/kaname-png/revoltx/commit/999fc40e390a483cba8a07edac9fe7dae1033dd2))
-   **listeners:** events for command and listener errors ([353de6d](https://github.com/kaname-png/revoltx/commit/353de6df3e2b7e78bb7635b802872d7b76def506))
-   **listeners:** extra argments in nonPrefixedCommand event ([3c1cdf9](https://github.com/kaname-png/revoltx/commit/3c1cdf9a5b06400664fa660a789b50097b90a3c2))
-   **types:** exported command enums ([d637ee6](https://github.com/kaname-png/revoltx/commit/d637ee6bf976289683eaeb00856f4413a7120b54))
-   **types:** rename client events ([a52d642](https://github.com/kaname-png/revoltx/commit/a52d642432d2c40c9d39db3ed7ef66e80b3bd643))

### Bug Fixes

-   **arguments:** catch for channel and member not found ([618d39d](https://github.com/kaname-png/revoltx/commit/618d39d0bf4e3bb5230915c0da44f8cb0a6b883e))
-   **client:** base pieces directory ([f66e297](https://github.com/kaname-png/revoltx/commit/f66e297c45280aa283434b1f9905b87c154fe0ca))
-   **client:** esm import ([6162ba1](https://github.com/kaname-png/revoltx/commit/6162ba1af9807b5d948786c5f5ab0bce78647e1a))
-   **client:** typo ([55fa202](https://github.com/kaname-png/revoltx/commit/55fa2021bc682c9455ac69f3ab1688dd05ca9195))
-   **core:** the client no longer inherits the client from revolt ([11a00b2](https://github.com/kaname-png/revoltx/commit/11a00b214c4451ec2f75be1fff2f70a9a9a3fc26))
-   dependencia requerida @sapphire/pieces ([6de9976](https://github.com/kaname-png/revoltx/commit/6de99763186c4c83e03431954085b3a6ed2d3c86))
-   **events:** fix typos ([c67d036](https://github.com/kaname-png/revoltx/commit/c67d036a9f71af1f092705d1476fa36e898c7a21))
-   jest config esm ([8cde948](https://github.com/kaname-png/revoltx/commit/8cde9489e847ab7d21cddd2a0f3cdf4a65abecc4))
-   **listeners:** default error listeners no working ([06f9b53](https://github.com/kaname-png/revoltx/commit/06f9b5337b79ec148869c1890988dc2101729f14))
-   **listeners:** wrong validation on message command ([9526fb3](https://github.com/kaname-png/revoltx/commit/9526fb39e407a1b406fe8f79812cce3564397394))
-   missing deps ([d680de9](https://github.com/kaname-png/revoltx/commit/d680de9ec0c055b8631b4b979ddacc59af30b4c5))
-   types ([9d69c16](https://github.com/kaname-png/revoltx/commit/9d69c16435b642d78e5008e914579d60998b6d6d))
-   types errors ([ec9cd99](https://github.com/kaname-png/revoltx/commit/ec9cd99802c3f3b94e5bfb5b964ca6c6e1fcc17a))
-   **types:** typo ([f13a730](https://github.com/kaname-png/revoltx/commit/f13a7306a7f8f64de95baf2fa41da92560a5a01f))
