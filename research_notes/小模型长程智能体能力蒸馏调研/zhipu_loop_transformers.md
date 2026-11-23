# Zhipu AI / Z.ai "Loop Transformer" (GLM-5.4) — research notes (as of 2026-11-23)

> Reading notes for the report writer
> - The thing being asked about is **GLM-5.4**, announced by Z.ai (智谱) on **2026-11-23** (the same day these notes were written) under the blog title "GLM-5.4: Toward Generalized Coding with Our First Loop Transformer". "Loop Transformer" is the architecture name; it is **not** a standalone paper or a small-model family.
> - Everything here is launch-day information. The official blog (https://z.ai/blog/glm-5.4) could **not** be fetched directly (page returned empty content), so all "official" details below are **as relayed by secondary coverage** (TNW, The Decoder, TestingCatalog, DataCamp, Fello AI, 光子星球, 澎湃). Where several outlets independently relay the same blog detail I treat it as "official claim (second-hand)".
> - No arXiv paper, model card, Hugging Face repo, or license for GLM-5.4 was found.
> - Tags used: **[OFFICIAL-2H]** = Z.ai claim relayed second-hand; **[3P]** = third-party test/opinion; **[RUMOR]** = unconfirmed.

## 1. What exactly is it (release date, paper/arXiv link, model sizes, open weights or API, license)?

### Takeaway
"Loop Transformer" is the architecture of **GLM-5.4**, Z.ai/Zhipu's ~750B-parameter flagship released 2026-11-23 to GLM Coding Plan / ZCode / Z.ai Chat users only; it is a blog-post-level disclosure (no paper), with API "coming soon" after a safety evaluation and open weights promised "after safety hardening" (no date, no license stated). It is a large flagship, not a small-model release.

### Cited Findings
- [OFFICIAL-2H] Z.ai's launch post is titled "Introducing GLM-5.4: Generalized Coding with Our First Loop Transformer"; Z.ai staffer Zixuan Li posted "GLM-5.4 is now available to all GLM Coding Plan users." Published 2026-11-23. The official blog URL is https://z.ai/blog/glm-5.4. — [TNW, 2026-11-23](https://thenextweb.com/news/zai-glm-5-4-loop-transformer-coding-model)
- [OFFICIAL-2H] Primary-source links as listed by TestingCatalog: Z.ai blog https://z.ai/blog/glm-5.4; Z.ai X posts https://x.com/Zai_org/status/2124811995912286352 and https://x.com/Zai_org/status/2124805514722771349; Zixuan Li https://x.com/ZixuanLi_/status/2124719275864670681. — [TestingCatalog](https://www.testingcatalog.com/z-ai-launches-glm-5-4-its-first-loop-transformer-model/)
- [OFFICIAL-2H] Scale: "the 750B scale"; no exact parameter count or active-parameter count published; early testers said ~700B. — [Fello AI](https://felloai.com/glm-5-4/); [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- Lineage: GLM-5 (2026-02-13) is 744B total / 40B active MoE; GLM-5.1 (Apr), GLM-5.2 (Jun 13, 1M context), GLM-5.3 (Aug 14, custom license), GLM-5.3 Flash (Aug 26, 320B total/18B active, MIT) all preceded it; GLM-5.4 is described as "~750B (looped GLM-5 base)". These figures are from a secondary aggregator without primary links. — [Fello AI GLM-5.5 page](https://felloai.com/glm-5-5/)
- [OFFICIAL-2H] Availability: live for GLM Coding Plan subscribers, in ZCode and Z.ai Chat; model IDs `glm-5.4[1m]` in Claude Code and `glm-5.4` in other tools; API "coming soon", to open after a safety evaluation; open weights planned after safety hardening; no license stated. — [TestingCatalog](https://www.testingcatalog.com/z-ai-launches-glm-5-4-its-first-loop-transformer-model/)
- [3P] Fello AI's availability check at 13:37–13:40 UTC on 2026-11-23 found no GLM-5.4 API price, no release notes, no Hugging Face repo, no Artificial Analysis page, and a 404 on the docs page. — [Fello AI](https://felloai.com/glm-5-4/)
- [3P] DataCamp likewise reports no Hugging Face repo, model card, license file, or developer-docs entry as of 2026-11-23. — [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- Chinese press framing: 澎湃 (2026-11-23 15:26) reported GLM-5.4 went live on the Coding Plan at noon while "官方尚未正式发布", and that per "智谱官方社群消息" it uses Loop Transformer and "是国内首款基于该架构的旗舰模型". — [澎湃新闻](https://www.thepaper.cn/newsDetail_forward_34539134)
- Context window 1M tokens; Coding Plan docs reportedly recommend setting the client window to 512,000 tokens for better coding results. — [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- New modality: vision input added "for stronger visual coding"; the prelude reportedly takes features from a 24-layer vision encoder. — [DataCamp](https://www.datacamp.com/blog/glm-5-4); [DEV Community explainer](https://dev.to/amananandrai/loop-transformers-thinking-deeper-without-getting-bigger-glm-54-inkling-2-mini-501m)
- Pre-history: 量子位 (2026-10-23) wrote that Zhipu "在中期报告中明确介绍了循环Transformer，并透露已在初步实验中验证了相关思路" in August 2026, quoting "循环Transformer可以让模型反复调用同一组网络层，在不显著增加参数量的情况下，完成更多轮内部计算，从而提升有效推理深度", with a cybersecurity example needing a ~20-step causal chain. At that time use in GLM-5.5 was only rumored. — [量子位 via 36氪, 2026-10-23](https://eu.36kr.com/zh/p/4037741762598025)
- Next model: Z.ai says a "significantly larger" model is coming soon (unnamed). Chinese press says management expects a ~3-trillion-parameter flagship in Q4 2026, which the market assumes is GLM-5.5 in December. [RUMOR for the name/date] — [TNW](https://thenextweb.com/news/zai-glm-5-4-loop-transformer-coding-model); [澎湃新闻](https://www.thepaper.cn/newsDetail_forward_34539134)

### Inferences
- The user's phrase "Loop Transformers recently released by Zhipu" maps to GLM-5.4's architecture. It is an architecture inside a closed-for-now flagship, documented by a technical blog post — not a paper and not a product line of small models.
- "Open weights" should currently be described as a promise, not a fact. HN commenters note Zhipu made the same promise for GLM-5.3 (see section 5).

### Gaps
- Official blog text not directly read (fetch returned empty). Exact wording, figures and any citations in the blog are second-hand.
- No arXiv paper or technical report found for the Zhipu Loop Transformer. An unrelated ACL Findings 2026 paper mentions "LoopCoder-40B-A80B-Loop" ([PDF](https://aclanthology.org/2026.findings-acl.796.pdf)) but I could not extract its authors; no evidence links it to Zhipu.
- Exact total/active parameter counts, license, API pricing, and weight-release date: not published.
- I could not locate the August 2026 interim-report passage itself (HKEX filing); the 量子位 paraphrase is the only source.

## 2. What is the architectural mechanism, and how does it differ from prior looped/recursive work?

### Takeaway
GLM-5.4 takes the already-trained GLM-5 MoE base and, via continued training (not from-scratch pretraining), makes a middle block of 28 layers (layers 27–54 of 78) run twice with shared weights — a fixed two-iteration loop, with per-token/per-pass gates for stability and KV-cache/sparse-index reuse to keep the second pass cheap. Unlike Universal Transformer / Ouro (adaptive halting or early exit) and unlike tiny recursive models, it is a fixed-depth, converted, production-scale design.

### Cited Findings
- [OFFICIAL-2H] Layout: layers 27–54 (28 layers) run twice; figure caption describes a 26-layer prelude and 24-layer coda. — [The Decoder, 2026-11-23](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- Derived layout: 78 stored layers performing 106 layer passes per token. — [DEV Community explainer](https://dev.to/amananandrai/loop-transformers-thinking-deeper-without-getting-bigger-glm-54-inkling-2-mini-501m)
- [OFFICIAL-2H] Conversion, not from-scratch: Z.ai says looped models trained from scratch still trail unshared-weight models at the same compute budget, so it adapted the pre-trained GLM-5 base through continued training. — [TNW](https://thenextweb.com/news/zai-glm-5-4-loop-transformer-coding-model); [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- [OFFICIAL-2H] Modification 1, gated progressive updates (门控渐进更新): each iteration has independent per-token gates controlling how much of the candidate update is written to the residual stream; pass 1 uses small gate values to stabilise activation norms, pass 2 opens the gates; harder tokens get larger pass-1 writes. Rationale: overwriting intermediate states each pass makes activations blow up and pushes later layers out of their trained range. — [光子星球 via 网易, 2026-11-24 CST](https://www.163.com/dy/article/LCFAJ8E00552GIEM.html); [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- [OFFICIAL-2H] Modification 2, hybrid KV cache (全局共享 + 滑窗独立): pass 2 reuses the sparse KV selected in pass 1 and keeps its own KV only inside a local sliding window, so an extra loop "only costs one sliding window of KV cache rather than a full context cache". One explainer gives the window as 128 tokens. Z.ai says the deployment-cost increase vs GLM-5.3 at 1M context is "manageable/可控" but gives no number. — [Fello AI](https://felloai.com/glm-5-4/); [DEV Community explainer](https://dev.to/amananandrai/loop-transformers-thinking-deeper-without-getting-bigger-glm-54-inkling-2-mini-501m); [光子星球](https://www.163.com/dy/article/LCFAJ8E00552GIEM.html)
- [OFFICIAL-2H] Modification 3, indexer reuse (复用索引器): pass 2 reuses pass 1's sparse-attention indices ("zero indexing overhead"), with "near-identical results to recomputing them". — [Fello AI](https://felloai.com/glm-5-4/); [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- [OFFICIAL-2H] The loop adds only small gating modules as new parameters. — [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- [OFFICIAL-2H] Z.ai validated the approach on 1B, 4B, 30B and 750B bases (only the 30B comparison has published numbers). — [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- Prior work, Universal Transformer: coverage and Z.ai trace the idea to the 2018 Universal Transformer, which combined weight sharing with Adaptive Computation Time for input-dependent halting. — [TNW](https://thenextweb.com/news/zai-glm-5-4-loop-transformer-coding-model); [DEV Community explainer](https://dev.to/amananandrai/loop-transformers-thinking-deeper-without-getting-bigger-glm-54-inkling-2-mini-501m)
- Prior work, Ouro (ByteDance Seed et al., arXiv 2510.25741, Oct 2025): trained-from-scratch looped LMs at 1.4B and 2.6B parameters, claimed to match 4B and 8B standard transformers; frames loop depth as a third scaling axis; includes a learned early exit so easier inputs use fewer loops. — [Ouro arXiv](https://arxiv.org/html/2510.25741v2); [DEV Community explainer](https://dev.to/amananandrai/loop-transformers-thinking-deeper-without-getting-bigger-glm-54-inkling-2-mini-501m)
- Prior work, theory-side looped transformers: "Looped Transformers are Better at Learning Learning Algorithms" (Yang et al., arXiv 2311.12424) and "Reasoning with Latent Thoughts: On the Power of Looped Transformers" (arXiv 2502.17416) are academic small-scale/in-context-learning studies, not production LLMs. — [arXiv 2311.12424](https://arxiv.org/pdf/2311.12424); [arXiv 2502.17416](https://arxiv.org/pdf/2502.17416)
- Contemporary peer, Thinking Machines Inkling 2 Mini (2026-11-20): 26.4B total / 3.4B active MoE, middle 12 of 24 stored layers run three times (48 passes), open weights under Apache 2.0, fits a 32GB Mac; vendor reports a non-looped model needed 7.5% less training compute but 140% more inference compute to match its loss on 512k-token agentic traces. — [DEV Community explainer](https://dev.to/amananandrai/loop-transformers-thinking-deeper-without-getting-bigger-glm-54-inkling-2-mini-501m); announcement at [thinkingmachines.ai](https://thinkingmachines.ai/news/inkling-2-mini/) (not fetched)
- Contemporary peer, OpenAI: The Decoder says OpenAI has used a similar architecture since "GPT-6 Astra"; 量子位 (2026-09-05) attributes the "循环深度" claim to a report by The Information. Not confirmed by OpenAI in the sources read. — [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/); [量子位, 2026-09-05](https://www.qbitai.com/2026/09/484726.html)
- Related Chinese work (Alibaba + universities): MeSH (ICLR 2026, arXiv 2510.07739) and SpiralFormer (EMNLP 2026, arXiv 2602.11698) diagnose "计算冗余" in looped models — later iterations change state less and less — at Pythia-1.4B scale. — [量子位, 2026-09-05](https://www.qbitai.com/2026/09/484726.html)
- Independent large study (arXiv 2610.40325, 2026-10-29; authors Ekbote, Pagnoni, Sachan, Bhosale, Lewis et al.; not Zhipu): looping the full transformer is best at a fixed parameter budget, looping a middle block is better when training FLOPs are limited; more loops can plateau, reverse or destabilise; loop-specific low-rank adapters help; looped decoding is slower in proportion to loop count. Models up to 1B params, up to 32 loops. — [arXiv 2610.40325](https://arxiv.org/abs/2610.40325)
- Design choice noted by HN commenters: the model "appear[s] to repeat a fixed number of times"; it is "a pretrained model converted to LOOPed, not trained looped from scratch". — [Hacker News thread](https://news.ycombinator.com/item?id=50609685)

### Inferences
- Distinguishing features vs prior work: (a) **conversion by continued training** of an existing 744B MoE rather than pretraining a looped model; (b) **fixed 2 iterations**, no ACT/halting/early-exit; (c) loop over a **middle block** only, consistent with arXiv 2610.40325's finding that middle-block looping wins when training compute is the constraint, and with Inkling 2 Mini's middle-layer result; (d) engineering for **serving cost at 1M context** (shared sparse KV, sliding-window second-pass cache, index reuse) — a problem small academic looped models never faced.
- Z.ai's own statement that from-scratch looped models underperform at equal compute is in tension with Ouro's "1.4B matches 4B" framing; the two are measured on different axes (equal compute vs equal parameters), so they are not strictly contradictory.
- HRM and TRM ("Tiny Recursive Model") were not mentioned in any GLM-5.4 coverage I read. From background knowledge only (not verified in this session): those are very small recursive networks trained on puzzle tasks such as ARC-AGI/Sudoku, i.e. a different regime from a looped general-purpose LLM. Treat this sentence as uncited context.
- The per-token gates are a stability device, not adaptive computation: every token still gets both passes.

### Gaps
- Exact gate formula, training recipe (data, steps, whether distillation from the unlooped base was used), and compute for the 750B conversion: not published in anything I could read.
- Whether Z.ai's blog cites Ouro, PLT, Giannou et al. or other prior work: unknown (blog not readable). Coverage only mentions Universal Transformer and "recent recurrent-depth work on small models".
- No verified source read for Giannou et al. "Looped Transformers as Programmable Computers" or for HRM/TRM in this session.

## 3. Headline selling points and the benchmark numbers supporting them

### Takeaway
The headline claim is that a ~750B looped model reaches "intelligence levels comparable to 2T–3T parameter models", but the only published evidence is an iso-parameter ablation on a **30B** model (+3.3 to +11.3 points on five benchmarks for ~10% more training compute, with 10–15% shorter outputs). Z.ai published **no benchmark scores for GLM-5.4 itself**; the sole independent number on launch day is one reviewer's harness.

### Cited Findings
- [OFFICIAL-2H] Equivalence claim: 750B-scale model reaches "intelligence levels comparable to 2T-3T parameter models". No head-to-head benchmark against any 2T–3T model is cited. — [Fello AI](https://felloai.com/glm-5-4/); [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- The Decoder notes the implied targets are Kimi K3.1 Pro (2.8T) and Qwen3.8-Max (2.4T). — [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- [OFFICIAL-2H] 30B iso-parameter ablation (looped vs same-size baseline; looped version used ~10% more total training compute): AIME25 19.17 → 30.42; GPQA-Diamond 47.58 → 56.26; AA-LCR 40.33 → 47.67; MMLU-Pro and IFBench each just over +3 points; improvement range 3.3–11.3 points across five benchmarks. — [Fello AI](https://felloai.com/glm-5-4/); [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- [OFFICIAL-2H] Largest gains in maths, scientific reasoning and long-context tasks. — [TNW](https://thenextweb.com/news/zai-glm-5-4-loop-transformer-coding-model)
- [OFFICIAL-2H] Output-length reduction in the 30B test: −14.9% on MMLU-Pro, −11.7% on GPQA-Diamond, −2% on AIME25; Z.ai says some reasoning shifts into the loop's extra depth (shorter chains of thought). — [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- [OFFICIAL-2H] Serving speed: up to 200 tokens/s off-peak, 70–80 tokens/s at peak; credited to fused kernels. — [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- [OFFICIAL-2H] No GLM-5.4 benchmark table; a team member said scores will come later. — [TestingCatalog](https://www.testingcatalog.com/z-ai-launches-glm-5-4-its-first-loop-transformer-model/)
- Pricing/quota: no API price. Coding Plan credit rates (input/cached/output) reported as 4.6/1.1/16 for GLM-5.4 vs 6.9/1.7/24 for GLM-5.3, i.e. ~1.5x tokens per credit; plans start at $18/month (also $80, $168 tiers reported). Zixuan Li framed this as 50% more weekly quota than GLM-5.3. — [Fello AI](https://felloai.com/glm-5-4/); [TestingCatalog](https://www.testingcatalog.com/z-ai-launches-glm-5-4-its-first-loop-transformer-model/)
- [3P] AICodeKing KingBench 4: GLM-5.4 scored 33.2/60 (31.8 on the same-prompt run), 7th of 19, first among "open" models; Claude Fable 5.2 led at 42.0, Gemini 4 Neon 37.9; GLM-5.3 scored 27.5 on a partial build. By effort: Low 25.2, Medium 24.1, High 28.8, Max 31.8. — [Fello AI](https://felloai.com/glm-5-4/)
- [3P] Same run: 431 minutes vs 109 for Gemini 4 Neon; 1,128 steps vs 244; ~1.04M reasoning tokens vs ~70,000; per-step time not slower (22.9 s vs 26.7 s); tool-call failure rate 1.56% (11th of 17) with 66% recovered on retry; cache hit rate 96–99%; median time-to-first-token 4.1 s. Methodology caveats: Neon graded most tasks, GLM-5.4 graded at least two of its own, models ran in different tools/effort levels. — [Fello AI](https://felloai.com/glm-5-4/)
- [3P, anecdotal] Chinese press: beta testers say GLM-5.4 "综合表现优于3万亿级别参数的Kimi K3.1 Pro，官方跑分暂未公布". — [澎湃新闻](https://www.thepaper.cn/newsDetail_forward_34539134)
- [3P, anecdotal] An X tester called it "at least Qwen4-max level" from a single one-shot test. — [TestingCatalog](https://www.testingcatalog.com/z-ai-launches-glm-5-4-its-first-loop-transformer-model/)
- Baseline for comparison: GLM-5.3 scored 31.7 on Artificial Analysis Intelligence Index v5 (max reasoning; read 2026-11-07) vs Kimi K3.1 Pro 46.5. No GLM-5.4 AA score exists yet. — [Fello AI GLM-5.5 page](https://felloai.com/glm-5-5/)

### Inferences
- The 2T–3T equivalence is an extrapolation from a 30B ablation plus unpublished internal evals; it is unverified.
- The 30B ablation is the cleanest data point for "parameter efficiency": same parameters, ~10% more training compute, large gains on reasoning-heavy benchmarks (AIME25 +11.25, GPQA-D +8.68, AA-LCR +7.34) and small gains on knowledge-style ones (~+3). This matches the pattern reported elsewhere (Inkling 2 Mini: looping did not improve knowledge scores; Bonn study cited by The Decoder: looping helps maths via depth, knowledge benefits from memory).
- Inference-cost claims are qualitative. Token-level savings (shorter CoT) in the 30B test coexist with the opposite behaviour in the shipped model ("marathon thinking", ~15x Neon's reasoning tokens in one harness), so net cost per task is unclear.
- Note a source disagreement on naming: The Decoder writes "Qwen3.8-Max (2.4T)", a tester quoted by TestingCatalog writes "Qwen4-max (2.4T)". Unresolved.

### Gaps
- No official GLM-5.4 scores on SWE-bench, Terminal-Bench, FrontierSWE, AA Index, or any agentic benchmark.
- No published numbers for the 1B, 4B, or 750B looped-vs-baseline comparisons.
- No serving-cost or latency-overhead figure for the second pass at 750B.
- No independent evaluation from Artificial Analysis, LMArena or similar as of 2026-11-23.

## 4. Does Zhipu claim it helps long-horizon agentic tasks or compressing large-model capability into small models? What evidence?

### Takeaway
Zhipu frames looping as buying **reasoning depth without parameters** — explicitly motivated by long dependent chains (a ~20-step cybersecurity causal chain; multi-step CAD/"generalized coding") and long-context tasks — and claims a 750B model performs like a 2T–3T one. It does **not** market Loop Transformer as a small-model or distillation technique; the only small-scale evidence is that the method was "validated" at 1B/4B/30B, with numbers only at 30B.

### Cited Findings
- Zhipu's stated rationale (Aug 2026 interim report, as paraphrased by 量子位): parameter count determines how much information is stored, compute depth determines how complex the reasoning can be; a cybersecurity task may need a ~20-step causal chain where "一旦中间某个环节掉链子，后续任务就可能全盘跑偏"; more loops raise compute cost, so balancing depth and efficiency remains open. — [量子位 via 36氪, 2026-10-23](https://eu.36kr.com/zh/p/4037741762598025)
- [OFFICIAL-2H] Z.ai says looping targets long chains of dependent steps, with FreeCAD modelling as the example; launch demos are long multi-step builds (self-narrated "Hello World" music video, 6-axis robotic arm in FreeCAD, a complete game, a GLSL 3D bird-watching scene). — [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- [OFFICIAL-2H] In the 30B ablation, long-context benchmark AA-LCR rose 40.33 → 47.67, among the largest gains. — [Fello AI](https://felloai.com/glm-5-4/)
- [OFFICIAL-2H] Capacity-compression claim: 750B looped ≈ 2T–3T conventional; method validated at 1B, 4B, 30B, 750B. — [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- [OFFICIAL-2H] Future direction: Z.ai says it will keep scaling loop depth and model size together, with a much larger next model soon. — [TestingCatalog](https://www.testingcatalog.com/z-ai-launches-glm-5-4-its-first-loop-transformer-model/)
- [OFFICIAL-2H] Acknowledged limitation relevant to long-horizon use: the model can get stuck in overly long "marathon thinking" (雷霆大思考) phases; Z.ai argues the extra self-checking still improves accuracy. 光子星球 notes Z.ai gives no answer on how to allocate compute by task difficulty or how gains change with more loops/larger models. — [光子星球](https://www.163.com/dy/article/LCFAJ8E00552GIEM.html)
- Strategy context: per 光子星球, Tang Jie (唐杰) sees GLM-5.4/5.5 pursuing two tracks — RSI-style self-iteration and longer, more autonomous agents; Zhipu says a GLM-5.3-driven Infra Agent designed/optimised GLM-5.3-Flash's inference infrastructure, going from first run on domestic accelerators to full production traffic in under two weeks with 3.2x end-to-end throughput (company claim). — [光子星球](https://www.163.com/dy/article/LCFAJ8E00552GIEM.html)
- [3P] Long-agentic-run behaviour in one independent harness: 1,128 steps and 431 minutes on KingBench 4, High/Max efforts hit a 180-second timeout while still reasoning on a security task; reviewer calls it "the most careful model that I have ever used" and recommends it as a reviewer rather than the primary coding agent. — [Fello AI](https://felloai.com/glm-5-4/)
- Small-model evidence comes from other labs, not Zhipu: Ouro 1.4B/2.6B claimed to match 4B/8B standard models; Thinking Machines' 26.4B-total/3.4B-active Inkling 2 Mini reports 79.2% SWE-bench Verified (vendor), and in a variable-loop research model the no-CoT time horizon rose from 16 s at 1 pass to 37 s at 3 passes and mean GPQA-Diamond reasoning tokens fell from 3,703 to 1,661. — [Ouro arXiv](https://arxiv.org/html/2510.25741v2); [DEV Community explainer](https://dev.to/amananandrai/loop-transformers-thinking-deeper-without-getting-bigger-glm-54-inkling-2-mini-501m)

### Inferences
- For a report on "distilling long-horizon agent capability into small models": Zhipu's release supports the general thesis that **depth-via-looping substitutes for parameters on reasoning-heavy and long-context tasks**, but its direct evidence is at 30B and above. The smallest scale with published Zhipu numbers is 30B; there is no Zhipu small (<10B) looped model.
- The mechanism is not distillation. It is architectural reuse plus continued training of the same base. Any "large-model capability in fewer parameters" reading is the 2T–3T equivalence claim, which is unverified.
- The conversion recipe (take a pretrained model, loop a middle block, continue training ~10% extra compute) is the part most transferable to small models, and Z.ai's remark that from-scratch looped models lose at equal compute is a relevant design caution.
- Evidence that looping helps agentic long-horizon tasks specifically is thin for GLM-5.4: demos and one long-context benchmark at 30B; no agentic benchmark numbers. The strongest quantitative long-horizon data point in this space on these dates is Thinking Machines' (vendor-reported) 512k-token agentic-trace efficiency figure, not Zhipu's.

### Gaps
- No Zhipu numbers on agentic benchmarks (SWE-bench-style, Terminal-Bench, long-horizon time-horizon metrics) for the looped vs unlooped model.
- No statement found from Zhipu about releasing small looped GLM models or using looping for edge/on-device models.
- 1B and 4B results unpublished, so the scaling trend of looping gains with model size is unknown.

## 5. Community reaction — independent evaluation or criticism

### Takeaway
Launch-day reaction is large (HN thread at 855 points / 302 comments) and mixed: appreciation for the architectural disclosure, but pointed criticism that the idea is not new, the model is a conversion rather than a natively looped model, flagship benchmarks are absent, the 2T–3T claim is unsupported, and the model over-thinks. Only one independent harness result exists; no Artificial Analysis-style evaluation yet.

### Cited Findings
- Hacker News "GLM-5.4: Toward Generalized Coding with Our First Loop Transformer": 855 points, 302 comments (read within ~8 hours of posting; only the first ~55% of the page was read). — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, novelty: "These sort of looped Transformer variants are not new" (HarHarVeryFunny, citing Universal Transformers); another commenter notes Thinking Machines shipped an open looped model (Inkling 2 Mini) the week before. — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, conversion: GLM-5.4 is "a pretrained model converted to LOOPed, not trained looped from scratch" (lolokazaki123), with a prediction of a wave of similar conversions. — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, missing benchmarks: commenters (ksec, simias) find the absence of benchmarks conspicuous and suspect GLM-5.4 is a preview ahead of the "significantly larger" model; one commenter says a ~3T model is rumored for next month. — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, open weights: a commenter questions the value of "safety hardening" given how fast abliterated versions appear; another notes Zhipu made the same promise for GLM-5.3. — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, hardware argument: one commenter claims looping eases memory-bandwidth limits; others rebut that it saves parameter capacity, not memory throughput, and helps mainly at high concurrency. — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, monitorability: a commenter suggests the fixed two iterations limit the loss of visibility into internal reasoning (commenter speculation, not a Z.ai statement). — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, access: simonw reports the model was not on OpenRouter, only via Z.ai's Coding Plan. — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- HN, over-thinking: several users complain of lengthy reasoning ("a 'waste' of tokens"); others say lower effort settings mitigate it. — [Hacker News](https://news.ycombinator.com/item?id=50609685)
- DataCamp reviewer: calls the evidence "a weaker evidence base than I would like" for a flagship launch; would not make GLM-5.4 the default coding agent; notes the "best open model" label rests on behaviour, not a license, since weights are unreleased; notes X discussion questioning which effort/harness produced the KingBench numbers. — [DataCamp](https://www.datacamp.com/blog/glm-5-4)
- AICodeKing (independent YouTuber harness): "the best Open Model you can use right now", "the most careful model that I have ever used", but weak on 3D/frontend and slow overall (431 min vs 109 for Gemini 4 Neon). — [Fello AI](https://felloai.com/glm-5-4/)
- The Decoder: stresses no 750B benchmark scores and no independent evaluations; frames the release as Z.ai following OpenAI into loop-transformer territory. — [The Decoder](https://the-decoder.com/z-ai-follows-openai-into-loop-transformer-territory-with-its-new-750b-flagship-model/)
- Chinese media: 光子星球 writes "目前公开的数据主要来自官方内部评测" and that third-party leaderboard validation is missing; 澎湃 relays beta-tester praise vs Kimi K3.1 Pro while noting no official scores. Zhipu (2513.HK) closed at HK$340.2, +1.86%, on 2026-11-23. — [光子星球](https://www.163.com/dy/article/LCFAJ8E00552GIEM.html); [澎湃新闻](https://www.thepaper.cn/newsDetail_forward_34539134)
- Earlier Chinese-media scepticism about the architecture class (pre-launch): 量子位 (2026-09-05) noted that at equal compute, parameter-saving looped models often lose to ordinary transformers because of "计算冗余". — [量子位](https://www.qbitai.com/2026/09/484726.html)
- Search-result summaries (not individually fetched, treat as low-confidence): a Reddit user "not impressed at all so far" vs DeepSeek V4.1 Flash on a debugging task; a report that GLM-5.4 failed to block symlink escapes that GPT-6.2 models blocked; a hobbyist toy experiment (looped 99.9% vs baseline 98.1% on mod-113 addition) whose author says it does not transfer to GLM-5.4's scale. — [DEV Community toy test](https://dev.to/frankchu/loop-transformer-999-vs-981-on-mod-113-addition-jnf); [DataCamp](https://www.datacamp.com/blog/glm-5-4)

### Inferences
- Consensus criticism clusters on evidence, not on the mechanism: the architecture description is considered credible and unusually detailed, while the performance-equivalence claim has no public support yet.
- Community reads GLM-5.4 as a stepping stone to a larger looped model (rumored ~3T "GLM-5.5", December 2026), so conclusions about Loop Transformer's ceiling are premature.

### Gaps
- No r/LocalLLaMA thread was located directly; Reddit sentiment above is from a search summary only.
- No 知乎 or 机器之心 analysis was located; Chinese coverage found was 澎湃, 光子星球, 界面/新浪 flashes, and earlier 量子位 pieces.
- X reactions (e.g. teortaxesTex) were not directly readable; only links are known.
- The second half of the HN thread was not read.
- All reaction is from the first ~24 hours; expect independent benchmarks (Artificial Analysis, SWE-bench-style) to appear later and possibly change the picture.
