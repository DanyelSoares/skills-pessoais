---
name: app-mobile
description: Desenvolve aplicativos mobile com React Native ou PWA — estrutura de projeto, componentes nativos, navegação, publicação. Use quando quiser criar um app para iOS/Android ou transformar um site em app instalável.
---

## Argumento (tipo de app / plataforma): $ARGUMENTS

---

## Escolha a abordagem certa

### React Native — app nativo real

**Quando usar:**
- App que precisa de câmera, GPS, notificações push, biometria
- Experiência nativa (performance, gestos, animações nativas)
- Publicar na App Store e Google Play

**Setup:**
```bash
# Expo (recomendado para começar)
npx create-expo-app MeuApp
cd MeuApp
npx expo start

# React Native puro (controle total)
npx react-native@latest init MeuApp
```

### PWA — Progressive Web App

**Quando usar:**
- Site que quer ser "instalável" no celular
- Sem necessidade de câmera, GPS, notificações nativas
- Quer evitar processo de publicação em stores
- Orçamento limitado

**Diferença prática:**
- PWA: o usuário adiciona à tela inicial, abre sem browser visível
- App nativo: publicado na store, performance superior, acesso a hardware real

---

## REACT NATIVE — Estrutura padrão

```
src/
  screens/          ← telas completas
    HomeScreen.tsx
    ProfileScreen.tsx
  components/       ← componentes reutilizáveis
    Button.tsx
    Card.tsx
  navigation/       ← configuração de rotas
    AppNavigator.tsx
  hooks/            ← lógica reutilizável
    useAuth.ts
  services/         ← chamadas de API
    api.ts
  store/            ← estado global (Zustand/Redux)
  utils/            ← helpers
  assets/           ← imagens, fontes
```

### Navegação (React Navigation)

```bash
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

```tsx
// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Componentes nativos essenciais

```tsx
import {
  View,           // div do mobile
  Text,           // qualquer texto
  TouchableOpacity, // botão clicável
  ScrollView,     // lista scrollável
  FlatList,       // lista longa (performance)
  TextInput,      // campo de formulário
  Image,          // imagem
  StyleSheet,     // estilos
  SafeAreaView,   // evita notch/statusbar
} from 'react-native';

// Estilos sempre via StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
});
```

### Estado global (Zustand — mais simples que Redux)

```bash
npm install zustand
```

```ts
import { create } from 'zustand';

interface AppStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## PWA — Transformar site em app instalável

### manifest.json

```json
{
  "name": "Nome do App",
  "short_name": "App",
  "description": "Descrição do app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker básico

```javascript
// sw.js
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('v1').then(cache => cache.addAll([
      '/', '/index.html', '/styles.css', '/app.js'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
```

```html
<!-- No index.html -->
<link rel="manifest" href="/manifest.json">
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

---

## Publicação na App Store / Google Play (Expo)

```bash
# Build para produção
npx eas build --platform android  # .aab para Google Play
npx eas build --platform ios      # .ipa para App Store

# Submit automaticamente
npx eas submit --platform android
npx eas submit --platform ios
```

**Pré-requisitos:**
- Google Play: conta developer ($25 única vez)
- App Store: conta Apple Developer ($99/ano)
- Ícones: 1024×1024px (App Store), 512×512px (Google Play)
- Screenshots de cada tamanho de tela exigido

---

## Design para mobile — regras fundamentais

- **Toque mínimo:** 44×44px (Apple HIG) / 48×48dp (Android Material)
- **Texto:** mínimo 16sp para corpo, 14sp com moderação
- **Scroll:** nunca scroll horizontal inesperado
- **Loading states:** skeleton screens > spinners
- **Gestos:** swipe to go back (iOS nativo), pull to refresh em listas
- **Safe areas:** usar `SafeAreaView` ou `useSafeAreaInsets` sempre
