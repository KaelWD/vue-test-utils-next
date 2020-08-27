import{g as n,f as s,z as a}from"./common-eb2a78a6.js";const t='{"title":"Testing Vuex","frontmatter":{},"headers":[{"level":2,"title":"Testing Vuex","slug":"testing-vuex"},{"level":2,"title":"A Simple Example","slug":"a-simple-example"},{"level":2,"title":"Testing with a Real Vuex Store","slug":"testing-with-a-real-vuex-store"},{"level":2,"title":"Testing with a Mock Store","slug":"testing-with-a-mock-store"},{"level":2,"title":"Testing Vuex in Isolation","slug":"testing-vuex-in-isolation"},{"level":2,"title":"Presetting the Vuex State","slug":"presetting-the-vuex-state"},{"level":2,"title":"Conclusion","slug":"conclusion"}],"lastUpdated":1598523040079.7786}';var p={};const e=a('<h2 id="testing-vuex"><a class="header-anchor" href="#testing-vuex" aria-hidden="true">#</a> Testing Vuex</h2><p>Vuex is just an implementation detail; no special treatment is required for testing components using Vuex. That said, there are some techniques that might make your tests easier to read and write. We will look at those here.</p><p>This guide you assumed you are familiar with Vuex. Vuex 4 is the version that works with Vue.js 3. Read the docs <a href="https://vuex.vuejs.org/" target="_blank" rel="noopener noreferrer">here</a>.</p><h2 id="a-simple-example"><a class="header-anchor" href="#a-simple-example" aria-hidden="true">#</a> A Simple Example</h2><p>Here is a simple Vuex store, and a component that relies on a Vuex store been present:</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vuex&#39;</span>\n\n<span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token function">createStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token function">state</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">{</span>\n      count<span class="token operator">:</span> <span class="token number">0</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  mutations<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">increment</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      state<span class="token punctuation">.</span>count <span class="token operator">+=</span> <span class="token number">1</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>The store simply stores a count, increasing it when the <code>increment</code> mutation is committed. This is the component we will be testing:</p><div class="language-js"><pre><code><span class="token keyword">const</span> App <span class="token operator">=</span> <span class="token punctuation">{</span>\n  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n    &lt;div&gt;\n      &lt;button @click=&quot;increment&quot; /&gt;\n      Count: {{ count }}\n    &lt;/div&gt;\n  </span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n  computed<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">count</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>count\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  methods<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&#39;increment&#39;</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h2 id="testing-with-a-real-vuex-store"><a class="header-anchor" href="#testing-with-a-real-vuex-store" aria-hidden="true">#</a> Testing with a Real Vuex Store</h2><p>To full test this component (and the Vuex store) are working, we will click on the <code>&lt;button&gt;</code> and assert the count is increased. In your Vue applications, usually in <code>main.js</code>, you install Vuex like this:</p><div class="language-js"><pre><code><span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span>\napp<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>store<span class="token punctuation">)</span>\n</code></pre></div><p>This is because Vuex is a plugin. Plugins are applied by calling <code>app.use</code> and passing in the plugin.</p><p>Vue Test Utils allows you to install plugins as well, using the <code>global.plugins</code> mounting option.</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vuex&#39;</span>\n\n<span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token function">createStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token function">state</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">{</span>\n      count<span class="token operator">:</span> <span class="token number">0</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  mutations<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">increment</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      state<span class="token punctuation">.</span>count <span class="token operator">+=</span> <span class="token number">1</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">test</span><span class="token punctuation">(</span><span class="token string">&#39;vuex&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> wrapper <span class="token operator">=</span> <span class="token function">mount</span><span class="token punctuation">(</span>App<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    global<span class="token operator">:</span> <span class="token punctuation">{</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span>store<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">await</span> wrapper<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token string">&#39;button&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">trigger</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">)</span>\n\n  <span class="token function">expect</span><span class="token punctuation">(</span>wrapper<span class="token punctuation">.</span><span class="token function">html</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toContain</span><span class="token punctuation">(</span><span class="token string">&#39;Count: 1&#39;</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>After installing the plugin, we use <code>trigger</code> to click the button and assert that <code>count</code> is increased. This kind of test, that covers the interaction between different systems (in this case, the Component and the store), is known as an integration test.</p><h2 id="testing-with-a-mock-store"><a class="header-anchor" href="#testing-with-a-mock-store" aria-hidden="true">#</a> Testing with a Mock Store</h2><p>In contrast, a unit test might isolate and test the component and the store separately. This can be useful if you have a very large application with a complex store. For this use case, you can mock the parts of the store you are interested in using <code>global.mocks</code>:</p><div class="language-js"><pre><code><span class="token function">test</span><span class="token punctuation">(</span><span class="token string">&#39;vuex using a mock store&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> $store <span class="token operator">=</span> <span class="token punctuation">{</span>\n    state<span class="token operator">:</span> <span class="token punctuation">{</span>\n      count<span class="token operator">:</span> <span class="token number">25</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    commit<span class="token operator">:</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">const</span> wrapper <span class="token operator">=</span> <span class="token function">mount</span><span class="token punctuation">(</span>App<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    global<span class="token operator">:</span> <span class="token punctuation">{</span>\n      mocks<span class="token operator">:</span> <span class="token punctuation">{</span>\n        $store\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token function">expect</span><span class="token punctuation">(</span>wrapper<span class="token punctuation">.</span><span class="token function">html</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toContain</span><span class="token punctuation">(</span><span class="token string">&#39;Count: 25&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">await</span> wrapper<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token string">&#39;button&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">trigger</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">)</span>\n  <span class="token function">expect</span><span class="token punctuation">(</span>$store<span class="token punctuation">.</span>commit<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toHaveBeenCalled</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>Instead of using a real Vuex store and installing it via <code>global.plugins</code>, we created our own mock store, only implementing the parts of Vuex used in the component (in this case, the <code>state</code> and <code>commit</code> function).</p><p>While it might seem convenient to test the store in isolation, notice that it won&#39;t give you any warning if you break your Vuex store. Consider carefully if you want to mock the Vuex store, or use a real one, and understand the trade-offs.</p><h2 id="testing-vuex-in-isolation"><a class="header-anchor" href="#testing-vuex-in-isolation" aria-hidden="true">#</a> Testing Vuex in Isolation</h2><p>You may want to test your Vuex mutations or actions in total isolation, especially if they are complex. You don&#39;t need Vue Test Utils for this, since a Vuex store is just regular JavaScript. Here&#39;s how you might test <code>increment</code> mutation without Vue Test Utils:</p><div class="language-js"><pre><code><span class="token function">test</span><span class="token punctuation">(</span><span class="token string">&#39;increment mutation&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token function">createStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    state<span class="token operator">:</span> <span class="token punctuation">{</span>\n      count<span class="token operator">:</span> <span class="token number">0</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    mutations<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token function">increment</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        state<span class="token punctuation">.</span>count <span class="token operator">+=</span> <span class="token number">1</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  store<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&#39;increment&#39;</span><span class="token punctuation">)</span>\n  \n  <span class="token function">expect</span><span class="token punctuation">(</span>store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>count<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><h2 id="presetting-the-vuex-state"><a class="header-anchor" href="#presetting-the-vuex-state" aria-hidden="true">#</a> Presetting the Vuex State</h2><p>Sometimes it can be useful to have the Vuex store in a specific state for a test. One useful technique you can use, other that <code>global.mocks</code>, is to create a function that wraps <code>createStore</code> and takes an argument to seed the initial state. In this example we extend <code>increment</code> to take an additional argument, which will be added on to the <code>state.count</code>. If that is not provided, we just increment <code>state.count</code> by 1.</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token function-variable function">createVuexStore</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">initialState</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">createStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  state<span class="token operator">:</span> <span class="token punctuation">{</span>\n    count<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    <span class="token operator">...</span>initialState\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  mutations<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">increment</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      state<span class="token punctuation">.</span>count <span class="token operator">+=</span> value\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">test</span><span class="token punctuation">(</span><span class="token string">&#39;increment mutation without passing a value&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token function">createVuexStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> <span class="token number">20</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  store<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&#39;increment&#39;</span><span class="token punctuation">)</span>\n  <span class="token function">expect</span><span class="token punctuation">(</span>store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>count<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">21</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">test</span><span class="token punctuation">(</span><span class="token string">&#39;increment mutation with a value&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token function">createVuexStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span> count<span class="token operator">:</span> <span class="token operator">-</span><span class="token number">10</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  store<span class="token punctuation">.</span><span class="token function">commit</span><span class="token punctuation">(</span><span class="token string">&#39;increment&#39;</span><span class="token punctuation">,</span> <span class="token number">15</span><span class="token punctuation">)</span>\n  <span class="token function">expect</span><span class="token punctuation">(</span>store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>count<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>By creating a <code>createVuexStore</code> function that takes an initial state, we can easily set the initial state. This allows us to test all the edge cases, while simplifying our tests.</p><p>The <a href="https://lmiller1990.github.io/vue-testing-handbook/testing-vuex.html" target="_blank" rel="noopener noreferrer">Vue Testing Handbook</a> has more examples for testing Vuex. Note: the examples pertain to Vue.js 2 and Vue Test Utils v1. The ideas and concepts are the same, and the Vue Testing Handbook will be updated for Vue.js 3 and Vue Test Utils 2 in the near future.</p><h2 id="conclusion"><a class="header-anchor" href="#conclusion" aria-hidden="true">#</a> Conclusion</h2><ul><li>Use <code>global.plugins</code> to install Vuex as a plugin</li><li>Use <code>global.mocks</code> to mock a global object, such as Vuex, for advanced use cases</li><li>Consider testing complex Vuex mutations and actions in isolation</li><li>Wrap <code>createStore</code> with a function that takes an argument to set up specific test scenarios</li></ul>',30);p.render=function(a,t,p,o,c,u){return s(),n("div",null,[e])};export default p;export{t as __pageData};