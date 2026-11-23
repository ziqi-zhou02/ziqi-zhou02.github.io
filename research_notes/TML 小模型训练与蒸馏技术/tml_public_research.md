# Thinking Machines Lab (TML): public research and technical methods, Feb 2025 – Nov 2026 (excluding deep coverage of the On-Policy Distillation post and the Inkling 2 Mini/Small launch pipelines)

Research date: 2026-11-23. All pages below were fetched on that date. "Paper-backed" means an arXiv paper exists; "blog-level" means the only source is a TML blog/news post or model card. Items marked UNVERIFIED are second-hand.

Quick dated catalogue (details and sources in the sections below):

| Date | Item | Type | Evidence level | Open code / weights |
|---|---|---|---|---|
| 2025-09-10 | Defeating Nondeterminism in LLM Inference (Horace He) | Connectionism blog | Blog-level, code released | `batch_invariant_ops`, MIT |
| 2025-09-26 | Modular Manifolds (Jeremy Bernstein) | Connectionism blog | Blog-level, builds on prior arXiv papers by the author | `manifolds`, MIT |
| 2025-09-29 | LoRA Without Regret (John Schulman et al.) | Connectionism blog | Blog-level, large sweep | Reproducible via tinker-cookbook |
| 2025-10-01 | Announcing Tinker | News | Product | `tinker`, `tinker-cookbook`, Apache-2.0 |
| 2025-10-27 | On-Policy Distillation (Kevin Lu et al.) | Connectionism blog | Blog-level (covered elsewhere) | cookbook `distillation` recipe |
| 2025-12-01 | Four Over Six (arXiv 2512.02010; Jack Cook first author) | arXiv paper | Paper-backed | github.com/mit-han-lab/fouroversix |
| 2025-12-12 | Tinker GA + vision input | News | Product | cookbook `vlm_classifier` |
| 2026-03-19 | Training LLMs to Predict World Events (Mantic guest post) | News | Blog-level, guest | cookbook `forecasting` recipe (later) |
| 2026-03-20 | ReViSQL (arXiv 2603.20004, UIUC/Bridgewater) | arXiv paper | Paper-backed, not TML-authored | github.com/uiuc-kang-lab/ReViSQL |
| 2026-05-11 | Interaction Models | Connectionism blog | Blog-level | None (SGLang upstream feature only) |
| 2026-06-30 | Learning to Replicate Expert Judgment in Financial Tasks (Bridgewater) | News | Blog-level | None |
| 2026-07-10 | The Future Worth Building Is Human | Connectionism blog | Position piece | n/a |
| 2026-07-15 | Inkling (975B/41B MoE) | News + model card | Blog-level | Weights, Apache-2.0 + AUP |
| 2026-07-30 | Inkling-Small (276B/12B) | News + model card | Blog-level | Weights, Apache-2.0 intent; NVFP4 variants |
| 2026-07-31 | A Safe Path to Open Weights | Connectionism blog | Framework, qualitative | n/a |
| 2026-08-27 | Putting Task Expertise into RL (text-to-SQL) | News | Paper-backed (2603.20004) | Code + datasets (UIUC repo) |
| 2026-10-15 | One Year of Tinker | News | Product | cookbook |
| 2026-11-05 | Inkling 2 Small (594B/17B) | News | Blog-level (covered elsewhere) | Weights from 2026-11-12 |
| 2026-11-13 | End-to-End 4-Bit Training (Jack Cook et al.) | Connectionism blog | Blog-level; component 4/6 is paper-backed | No kernel code released |
| 2026-11-20 | Inkling 2 Mini (26.4B/3.4B looped MoE) + TML-d24-varloop-research | News + model cards | Blog-level (covered elsewhere) | Weights, Apache-2.0 + AUP |

## What posts has TML published on its research blog ("Connectionism") and news page through November 2026, and what does each say about training, fine-tuning, compression or distillation?

### Takeaway
As of 2026-11-23 the Connectionism index lists exactly 8 posts and the News index 15 items; the ones that document reusable training methods in detail are "LoRA Without Regret", "Defeating Nondeterminism", "Modular Manifolds", "On-Policy Distillation", "End-to-End 4-Bit Training", plus three Tinker case studies (forecasting, financial judgment, text-to-SQL) that give full RL recipes. There is no standalone TML post on pruning, looped transformers, reward hacking or synthetic environments; those topics appear only inside the Inkling launch posts and model cards.

### Cited Findings

**Index enumeration**
- The Connectionism index lists 8 posts: End-to-End 4-Bit Training (Nov 13, 2026, Jack Cook et al.); A Safe Path to Open Weights (Jul 31, 2026); The Future Worth Building Is Human (Jul 10, 2026); Interaction Models (May 11, 2026); On-Policy Distillation (Oct 27, 2025, Kevin Lu et al.); LoRA Without Regret (Sep 29, 2025, John Schulman et al.); Modular Manifolds (Sep 26, 2025, Jeremy Bernstein); Defeating Nondeterminism in LLM Inference (Sep 10, 2025, Horace He et al.) — [TML blog index](https://thinkingmachines.ai/blog/)
- The News index lists 15 items: Inkling 2 Mini (Nov 20, 2026); Inkling 2 Small (Nov 5, 2026); One Year of Tinker (Oct 15, 2026); Putting Task Expertise into RL / Text-to-SQL (Aug 27, 2026); Safety Research Grants (Aug 24, 2026); Inkling-Small (Jul 30, 2026); Inkling (Jul 15, 2026); Learning to Replicate Expert Judgment in Financial Tasks (Jun 30, 2026); Interactivity Research Grants (May 19, 2026); Training LLMs to Predict World Events, guest post with Mantic (Mar 19, 2026); NVIDIA gigawatt-scale partnership (Mar 10, 2026); Tinker GA and Vision Input (Dec 12, 2025); Tinker Call for Community Projects (Nov 7, 2025); Tinker Research and Teaching Grants (Oct 29, 2025); Announcing Tinker (Oct 1, 2025) — [TML news index](https://thinkingmachines.ai/news/)

**2025-09-10 — Defeating Nondeterminism in LLM Inference (Horace He et al.)**
- Argument: LLM inference nondeterminism comes from kernels that are not batch-invariant, combined with server load changing batch size; fix is batch-invariant RMSNorm, matmul and attention kernels — [post](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- Results: 1000 temperature-0 completions from Qwen3-235B-A22B-Instruct-2507 gave 80 unique outputs (most common 78 times, first divergence at token 103); with batch-invariant kernels all 1000 were identical. Speed on Qwen3-8B, 1000 requests, one GPU: vLLM default 26 s, deterministic unoptimised 55 s, improved attention kernel 42 s; batch-invariant matmul lost about 20% vs cuBLAS — [post](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- Relevance to on-policy RL: sampler/trainer numeric mismatch turns on-policy RL off-policy. In RLVR on BigMath, training without importance weighting collapsed around step 318 with a KL spike; importance weighting held KL near 0.001; bitwise-identical sampler and trainer gave KL exactly 0 — [post](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- Code: github.com/thinking-machines-lab/batch-invariant-ops, MIT licence — [post](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/); [GitHub org listing](https://github.com/orgs/thinking-machines-lab/repositories)

**2025-09-26 — Modular Manifolds (Jeremy Bernstein)**
- Method: constrain weight matrices to the Stiefel manifold (all singular values 1) and take steepest-descent steps under the spectral norm ("manifold Muon"), solved by dual ascent over Lagrange multipliers using the matrix sign function, then retract with msign(W). "Modular manifolds" compose (forward function, manifold, norm) triples so that scalar coefficients budget learning rate across layers — [post](https://thinkingmachines.ai/blog/modular-manifolds/)
- Experiment: small MLP on CIFAR-10 for 3 epochs, 3 seeds, vs AdamW at several weight decays; manifold Muon reached higher train and test accuracy, final singular values near 1, at higher wall-clock per step. The page text gives no exact accuracy numbers — [post](https://thinkingmachines.ai/blog/modular-manifolds/)
- Stated open direction relevant to compression: whether manifold constraints affect value ranges and make low-precision training easier — [post](https://thinkingmachines.ai/blog/modular-manifolds/)
- Code: github.com/thinking-machines-lab/manifolds, MIT licence — [GitHub org listing](https://github.com/orgs/thinking-machines-lab/repositories)
- Production follow-through: the Inkling launch post says pretraining used Muon for large matrices and Adam for other parameters with weight decay coupled to the square of the learning rate, and links to Modular Manifolds — [Inkling launch post](https://thinkingmachines.ai/news/introducing-inkling/)

**2025-09-29 — LoRA Without Regret (John Schulman et al.)**
- Setup: ranks 1–512 with per-condition LR sweeps on Llama 3 and Qwen3 models including MoE Qwen3-30B-A3B-Base; SFT on Tulu3 and OpenThoughts3 (log-loss evaluation); RL on MATH, GSM8K, DeepMath — [post](https://thinkingmachines.ai/blog/lora/)
- Findings: LoRA matches full fine-tuning (FullFT) on small-to-medium SFT datasets and falls off the minimum-loss curve once dataset size exceeds adapter capacity; optimal LoRA LR is about 10x the FullFT optimum (fitted multiplier 9.8 across 14 models; about 15x for runs under ~100 steps, flagged anecdotal); optimal LR varies under 2x between rank 4 and 512; LoRA is less tolerant of large batch sizes regardless of rank — [post](https://thinkingmachines.ai/blog/lora/)
- Layer placement: apply LoRA to all layers, especially MLP/MoE; attention-only rank 256 (0.25B params) underperforms MLP-only rank 128 (0.24B params) — [post](https://thinkingmachines.ai/blog/lora/)
- RL: LoRA matches FullFT for policy-gradient RL even at rank 1 (about 3M params on Llama-3.1-8B); argument is that RL supplies roughly O(1) bits per episode, e.g. MATH at ~10,000 problems x 32 samples is about 320,000 bits — [post](https://thinkingmachines.ai/blog/lora/)
- Compute: LoRA costs 2N^2 + 6NR multiply-adds per weight matrix vs 3N^2 for FullFT, i.e. slightly more than two-thirds of FullFT FLOPs — [post](https://thinkingmachines.ai/blog/lora/)
- Open questions the authors list include best practice for LoRA on MoE layers under expert parallelism and variants such as PiSSA — [post](https://thinkingmachines.ai/blog/lora/)

**2025-10-27 — On-Policy Distillation (Kevin Lu et al.)** — covered in depth by another researcher. One-line pointer: listed on the index with that date and author; the cookbook `distillation` recipe reproduces it — [blog index](https://thinkingmachines.ai/blog/); [distillation recipe README](https://github.com/thinking-machines-lab/tinker-cookbook/tree/main/tinker_cookbook/recipes/distillation)

**2026-03-19 — Training LLMs to Predict World Events (guest post, Scott Jeen and Matthew Aitchison, Mantic)**
- Method: RL fine-tuning of gpt-oss-120b on Tinker for judgmental forecasting; policy gradient with GRPO-style advantage normalisation without dividing by standard deviation, importance-sampling correction for sampler/trainer token-probability mismatch; reward is Brier score (more stable than log score); group size 8, batch size 64; about 10k binary questions dated Aug 2024–Dec 2025 with precomputed research context — [post](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)
- Results: Metaculus baseline score rose from 38.6 to 45.8 per question on the Metaculus Q2 2025 AI Benchmark Tournament set, described as on par with the best general models; with Mantic research and tools the gain was about 7 points and marginally exceeded Gemini 3 Pro; without them about 3 points. In an optimal 5-sample ensemble the fine-tuned model got 2 of 5 slots (40% weight) — [post](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)
- Key quote: "The fine-tuned model learns a forecasting policy that is as accurate as the frontier LLMs, yet decorrelated from them." — [post](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)
- Artifacts: no training code or weights in the post; question list published as a GitHub Gist — [post](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)

**2026-05-11 — Interaction Models: A Scalable Approach to Human-AI Collaboration**
- Method: a real-time "interaction model" processes audio, video and text in 200 ms time-aligned micro-turns interleaved into one token sequence, paired with an asynchronous background model for reasoning and tools; encoder-free early fusion (dMel audio, 40x40 image patches via hMLP, flow head for audio output), all co-trained from scratch with the transformer — [post](https://thinkingmachines.ai/blog/interaction-models/)
- Model: TML-Interaction-Small is a 276B-parameter MoE with 12B active; larger pretrained models were "currently too slow to serve in this setting" — [post](https://thinkingmachines.ai/blog/interaction-models/)
- Training-infrastructure detail: batch-invariant kernels give bitwise trainer-sampler alignment at under 5% end-to-end overhead — [post](https://thinkingmachines.ai/blog/interaction-models/)
- Results: FD-bench V1 latency 0.40 s (GPT-realtime-2.0 minimal 1.18 s); FD-bench V1.5 average 77.8 vs 46.8; TimeSpeak macro-accuracy 64.7 vs 4.3; CueSpeak 81.7 vs 2.9. Several benchmarks are internal or TML adaptations — [post](https://thinkingmachines.ai/blog/interaction-models/)
- Distillation and RL are not discussed; no weights or training code released (only an upstreamed SGLang streaming-session feature) — [post](https://thinkingmachines.ai/blog/interaction-models/)

**2026-06-30 — Learning to Replicate Expert Judgment in Financial Tasks (Bridgewater AIA Labs: Sarah Su, Kevin Zhu, Emily Xiao, Rohan Alur, Daniel Kang, with TML)**
- Method: Qwen3-235B trained on Tinker on six investor information-filtering tasks. Start from GRPO with importance-sampling loss, then add (1) interleaved round-robin per-task batching, +12.1% accuracy over mixed batches; (2) CISPO loss with asymmetric clipping, +10.1%; (3) on-policy distillation used as a regulariser, where the advantage is built from reward penalised by student-teacher log-prob divergence and every 20 steps the current checkpoint is promoted to teacher only if validation accuracy hits a new high, +3.1% over a frozen base-model teacher — [post](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)
- Data cleaning: train on noisy vendor labels, re-evaluate on the same data, and route only contested examples to experts — [post](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)
- Results: average accuracy Qwen base 44.8%, + GRPO 73.48%, final recipe 84.66% (positive F1 92.99%); best frontier model with expert prompt 78.2% (GPT 5.5); 29.8% fewer mistakes and 13.8x lower inference cost per task. Leave-one-out: without interleaving 72.18%, without CISPO 74.56%, without OPD 72.39% — [post](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)
- No code or weights; results are on "a subset of data cleared for public release" — [post](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)

**2026-07-10 — The Future Worth Building Is Human (position piece)**
- Thesis: knowledge is tacit and local, so AI should be distributed and customisable; "For organizations and individuals to align AI to their own values, these values must be encoded in the model weights."; argues prompt-only customisation changes surface behaviour while deeper habits stay; lists Inkling (models), Tinker (tools), interaction models (interfaces), human-AI collaboration evaluation, and decentralised alignment as research directions — [post](https://thinkingmachines.ai/blog/the-future-worth-building-is-human/)

**2026-07-15 — Inkling: Our Open-Weights Model (context for later small models)**
- Architecture: MoE, 975B total / 41B active, 1M context; largely follows DeepSeek-V3 with 256 routed + 2 shared experts per layer, 6 routed active per token, sigmoid router with auxiliary-loss-free load balancing; sliding-window and global attention interleaved 5:1; relative positional embeddings instead of RoPE; short convolutions — [Inkling launch post](https://thinkingmachines.ai/news/introducing-inkling/)
- Training: 45T tokens of pretraining on GB300 NVL72; post-training began with an SFT bootstrap on synthetic data from open-weights models including Kimi K2.5 (small share of compute), then asynchronous RL with over 30M rollouts across two long runs on synthetic and human-created environments; held-out reasoning aggregate reward rose log-linearly from 0.264 (SFT init) to 0.356 (released) — [Inkling launch post](https://thinkingmachines.ai/news/introducing-inkling/)
- Reward-hacking mitigation: a rubric grader plus a claims grader that verifies each factual claim with agentic web search, because rubrics alone can be gamed by listing plausible facts; calibration trained by RL against proper scoring rules; controllable effort via system message and per-token cost; chain-of-thought became more concise over RL without being rewarded for it — [Inkling launch post](https://thinkingmachines.ai/news/introducing-inkling/)
- Selected results: SWE-bench Verified 77.6%, GPQA Diamond 87.2%, HLE text-only 29.7%; the post says Inkling "is not the strongest overall model available today, open or closed." — [Inkling launch post](https://thinkingmachines.ai/news/introducing-inkling/)
- TechCrunch reports the company said its next model would use fully self-contained post-training (no bootstrap data from other open-weight models) — [TechCrunch, 2026-07-15](https://techcrunch.com/2026/07/15/thinking-machines-amps-up-its-bet-against-one-size-fits-all-ai-with-its-first-open-model-inkling/)

**2026-07-30 — Introducing Inkling-Small (first TML large-to-small transfer)**
- Model: 276B total / 12B active MoE, about a quarter of Inkling's size — [Inkling-Small post](https://thinkingmachines.ai/news/inkling-small/)
- Method as described: changed pretraining data mix and recipe; the earlier "preview" checkpoint was post-trained "in part using on-policy distillation with Inkling as the teacher"; then "we continued scaling agentic coding RL for two weeks"; calibration by RL against proper scoring rules; inherited Inkling's safety post-training recipe — [Inkling-Small post](https://thinkingmachines.ai/news/inkling-small/)
- Results vs Inkling: SWE-bench Verified 80.2% vs 77.6%; GPQA Diamond 89.5% vs 87.2%; HLE text-only 31.6% vs 29.7%; GDPval-AA v2 Elo 1269 vs 1238; but SimpleQA Verified 20.6% vs 43.9% and FORTRESS adversarial refusal 71.6% vs 78.0% — [Inkling-Small post](https://thinkingmachines.ai/news/inkling-small/)

**2026-07-31 — A Safe Path to Open Weights**
- Framework post, no numeric results: three internal evaluation tracks (CBRN/cyber dual-use; agentic misuse; multimodal harmful prompts across 17 languages), four external red-teamers (Scale AI, Handshake AI, FAR.AI, Apollo Research), and adversarial "helpful-only" fine-tunes to test whether removing safeguards adds uplift; conclusion that releasing Inkling was "not likely to add material risk beyond what existing open-weight models already pose" — [post](https://thinkingmachines.ai/blog/a-safe-path-to-open-weights/)
- States "refusal behavior cannot be treated as a durable safeguard" for open weights and floats pretraining data filtering to decouple dangerous knowledge as an open research question; describes staged release (API, then vetted fine-tuning via Tinker, then white-box, then public) — [post](https://thinkingmachines.ai/blog/a-safe-path-to-open-weights/)

**2026-08-27 — Putting Task Expertise into RL Achieves State-of-the-Art Performance on Text-to-SQL (Yuxuan Zhu, Tengjun Jin, Yoojin Choi of UIUC; Daniel Kang of Bridgewater AIA Labs and UIUC; with TML)**
- Method: Kimi-K2.6 fine-tuned with RLVR on Tinker using CISPO, LoRA rank 32, LR 5e-5, batch size 64, group size 16; up to 5 database interaction turns per episode — [post](https://thinkingmachines.ai/news/putting-task-expertise-into-rl/)
- Data: audit of 2.5k BIRD Train instances found at least one error in 61.1% (gold SQL 52.1%, question 26.2%, external knowledge 18.2%); cleaned set released as BIRD-Platinum; an o3 auditor had 90.6% precision but caught only 24.5% of human-flagged errors — [post](https://thinkingmachines.ai/news/putting-task-expertise-into-rl/)
- Reward shaping against false-positive reward: execution matches that the VeriEQL equivalence checker refutes get a 0.2 penalty (pilot: 32.8% of positive rewards went to non-equivalent queries); a rule-based process reward requires a requirement block mapping external knowledge to constraints, 0.1 penalty otherwise (pilot: 24.2% of failures ignored supplied knowledge) — [post](https://thinkingmachines.ai/news/putting-task-expertise-into-rl/)
- Results on Arcwise-Plat-SQL: 91.37% greedy at $0.035/task, 92.97% with SC-16 at $0.56/task; verified data only (before reward shaping) 88.55%; GPT-5.6 Sol Ultra 86.75%; Claude Fable 5 84.94%; human proxy 92.96%. The post text reports SC-16 as both 92.96% and 92.97% — [post](https://thinkingmachines.ai/news/putting-task-expertise-into-rl/)
- Paper-backed: arXiv 2603.20004 "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering" (submitted 2026-03-20, v4 2026-08-21); code and data at github.com/uiuc-kang-lab/ReViSQL; weights not released — [arXiv 2603.20004](https://arxiv.org/abs/2603.20004); [post](https://thinkingmachines.ai/news/putting-task-expertise-into-rl/)

**2026-11-13 — End-to-End 4-Bit Training (Jack Cook et al.)**
- Scope: the recipe used for Inkling 2 Small from pretraining through the final RL rollout; the post calls Inkling 2 Small "the largest model we are aware of that was trained end-to-end with a native 4-bit forward pass" — [post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- Formats on GB300: NVFP4 is FP4 (E2M1) values with an E4M3 scale per block of 16, 4.5 bits/value, 15 PFLOPS; MXFP8 8.25 bits, 5 PFLOPS; BF16 16 bits, 2.5 PFLOPS; NVFP4 "is stored with 3.6x fewer bits than BF16, but it runs up to 6x faster on GB300s" — [post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- What is quantised: MoE expert-layer forward GEMMs in NVFP4 with per-token outer scales on activations and per-expert outer scales on weights; backward pass dequantises saved forward tensors, transposes in higher precision, re-quantises to MXFP8 with stochastic rounding, and runs gradient GEMMs in MXFP8; the last one-sixth (16.6%) of layers run in MXFP8; master weights are FP32; optimiser state is not discussed — [post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- Design choices: 1x16 weight scales rather than NVIDIA's 16x16 tiles (which were "too coarse, hurting CE beyond what we were willing to accept"); "Four Over Six" adaptive block scaling on activations only; expert-parallel dispatch in NVFP4 and combine in a block-scaled 8-bit format (S2F6) after a 32-dimensional random Hadamard transform, cutting combine traffic from 16 to 8.25 bits/value with no measurable accuracy degradation — [post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- Results: about 8% wall-clock speedup in pretraining over full-MXFP8 at about 2% compute-efficiency cost; about 20% speedup in RL with "no discernible difference in reward"; Inkling 2 Small pretrained "in just 68 hours on GB300 NVL72 racks"; full NVFP4 (forward and backward) caused "very large hits" to compute efficiency — [post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- Deployment link: the recipe "eliminates the need for calibration when a quantized checkpoint is delivered at the end of training"; no direct QAT/PTQ comparison is run — [post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- No kernel code or licence is released; the MoE kernel stack ("BBBK") is described only in prose and PTX snippets — [post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)

**Inkling 2 Small (2026-11-05) and Inkling 2 Mini (2026-11-20)** — covered in depth by other researchers. Pointers only: Inkling 2 Small is a 594B/17B MoE trained with a single joint RL run, NVFP4, a synthetic coding data pipeline, on-policy self-distillation (citing arXiv 2601.18734 and 2601.19897) and reward-hacking evaluation via HoneyBench — [Inkling 2 Small post](https://thinkingmachines.ai/news/inkling-2-small/). Inkling 2 Mini is a 26.4B/3.4B-active looped MoE (24 layers, middle blocks run three times) made with expert pruning, healing on about 1T tokens distilled from a larger internal model, and an RL run of 2.2T tokens over 2,000 steps — [Inkling 2 Mini post](https://thinkingmachines.ai/news/inkling-2-mini/)

### Inferences
- TML's public output splits into two tiers: (a) four 2025 Connectionism posts that read like papers and ship code or reproducible recipes, and (b) 2026 launch posts and case studies that disclose recipes at a headline level. The 2026 material most directly about small-model compression (pruning + healing, looping) exists only in launch posts and model cards, not as standalone method write-ups.
- The best-documented, independently reproducible building blocks are LoRA hyperparameter guidance, batch-invariant kernels, on-policy distillation (cookbook recipe), the CISPO + interleaving + self-teacher OPD recipe (financial tasks; no code), and the ReViSQL reward-shaping recipe (code + paper).
- The Inkling-Small post is the first public evidence of TML's large-to-small pattern: on-policy distillation from the bigger model as a bootstrap, followed by more RL. The benchmark deltas (reasoning and coding above the teacher, SimpleQA far below) are consistent with the Inkling 2 Mini observation that knowledge tracks total parameter count while reasoning can be transferred or trained.
- The 4-bit post shows TML treats low-precision as a training-time property (native NVFP4 forward from pretraining through RL), so the shipped quantised checkpoint needs no post-hoc calibration; this is the compression analogue of "train in the format you deploy".

### Gaps
- One web summary claims Connectionism posts covered "kernel numerics and asynchronous reinforcement learning and consistency in retrieval-augmented systems"; no such posts appear on the index, so this is UNVERIFIED and likely inaccurate (seen only in search-result synthesis, no primary URL).
- No standalone TML post on pruning, looped transformers, reward hacking, or synthetic environment construction was found; whether TML plans dedicated write-ups is unknown.
- Modular Manifolds gives no numeric accuracies in text; scale-up results for manifold Muon on LLMs are not published.
- The 4-bit post does not state Inkling 2 Small's optimiser-state precision or release kernels.
- I did not fetch the two grants posts, the NVIDIA partnership post, or the Tinker community-projects post; they are listed by title and date only.

## What do the Tinker platform and the open-source tinker-cookbook expose as recipes, and what changed in Tinker during 2026?

### Takeaway
Tinker exposes four low-level primitives (sample, forward_backward, optim_step, save_state) and the Apache-2.0 tinker-cookbook ships runnable recipes for on-policy and off-policy distillation, multi-teacher and multi-turn tool-use distillation, prompt distillation, self-distillation fine-tuning (SDFT), RL for math/code/search/terminal tasks, rubric grading and a 12-benchmark evaluation harness. During 2026 Tinker added Inkling models, about 20 further model families up to 1T+ parameters, CISPO/DRO/custom RL losses, top-k logprobs for distillation, weight download, and a beta of full fine-tuning, though LoRA remains the default.

### Cited Findings

**Platform timeline**
- 2025-10-01: Tinker announced as "a flexible API for fine-tuning language models" in private beta; primitives `forward_backward` and `sample`; "We use LoRA so that we can share the same pool of compute between multiple training runs, lowering costs."; early users Princeton Goedel Team, Stanford Rotskoff group, Berkeley SkyRL, Redwood Research (RL on Qwen3-32B) — [Announcing Tinker](https://thinkingmachines.ai/news/announcing-tinker/)
- 2025-12-12: general availability; Kimi K2 Thinking added; OpenAI-compatible sampling; vision input via Qwen3-VL-30B-A3B and Qwen3-VL-235B-A22B; VLM image-classifier recipe — [Tinker GA post](https://thinkingmachines.ai/news/tinker-general-availability/)
- 2026-07-15: Inkling fine-tunable on Tinker with 64K and 256K context; three new audio recipes; `tml-renderers` package; a demo where Inkling in OpenCode wrote and ran its own Tinker fine-tuning job in about 27 minutes — [Inkling launch post](https://thinkingmachines.ai/news/introducing-inkling/)
- 2026-10-15 ("One Year of Tinker"): API described as four functions (sample, forward_backward, optim_step, save_state); launched with 14 text-only Qwen and Llama models and added over 20 more from Qwen, Nemotron, Kimi, GLM, DeepSeek, GPT-OSS and Inkling, ranging from 4B to 1T parameters; added CISPO and DRO, custom RL losses, and top-k logprobs for distillation and scoring; LoRA-specific kernels, autoscaling, checkpoint lineage — [One Year of Tinker](https://thinkingmachines.ai/news/one-year-of-tinker/)
- Full fine-tuning: "we have begun offering full fine-tuning as a beta feature and are considering a broader release"; LoRA remains the stated default — [One Year of Tinker](https://thinkingmachines.ai/news/one-year-of-tinker/). The docs overview still says "Tinker implements low-rank adaptation (LoRA) fine-tuning, not full fine-tuning." — [Tinker docs overview](https://tinker-docs.thinkingmachines.ai/tinker/)
- Weight portability: docs say trained weights can be downloaded for use outside Tinker — [Tinker docs overview](https://tinker-docs.thinkingmachines.ai/tinker/)
- Loss pages in the docs sidebar: Cross-Entropy, Importance Sampling, PPO, CISPO, DRO, GSPO, StableReinforce (alpha), Custom — [Tinker docs overview](https://tinker-docs.thinkingmachines.ai/tinker/)
- Current model list (Nov 2026) includes Inkling 2 Mini (26B/5.4B effective active), Inkling 2 Small (594B/17B), Inkling (975B/41B), Inkling-Small (276B/12B), Kimi-K3.1-Pro (2.8T/104B), Kimi-K2.6, GLM-5.3, DeepSeek-V4.1-Flash, Nemotron 3/3.5, Qwen3.5-4B/9B, Qwen3.6-35B-A3B, Qwen3.8-27B, GPT-OSS-20B/120B — [Tinker models page](https://tinker-docs.thinkingmachines.ai/tinker/models/)
- The TML-d24-varloop-research variable-loop model is weights-only and "not available through an API, including Tinker" — [varloop model card](https://huggingface.co/thinkingmachines/TML-d24-varloop-research)

**Cookbook overview**
- Repo: thinking-machines-lab/tinker-cookbook, "Post-training with Tinker", Apache-2.0, about 4.3k stars, 556 commits, last updated 2026-11-20; includes 20+ marimo tutorial notebooks and Claude Code skills (`/tinker:research`, `/tinker:debug`, `/tinker:rollout-ui`, `/tinker:inkling`) — [tinker-cookbook repo](https://github.com/thinking-machines-lab/tinker-cookbook); [GitHub org listing](https://github.com/orgs/thinking-machines-lab/repositories)
- Recipe index: `chat_sl`, `math_rl`, `code_rl` (DeepCoder replication), `preference` (three-stage RLHF, DPO), `search_tool` (retrieval tool use), `rl_numerics_check` (60K+ token many-turn episodes to check trainer/sampler logprob match), `forecasting` (Brier reward), `prompt_distillation`, `multiplayer_rl`, `distillation`, `rubric` (LLM-grader rewards), `verifiers_rl` (Prime Intellect Environments Hub), `vlm_classifier`, `audio`, `harbor_rl` (Terminal-Bench-style sandboxed tasks), `sdft`, `true_thinking_score` (chain-of-thought faithfulness), `decisions` — [recipes README](https://github.com/thinking-machines-lab/tinker-cookbook/blob/main/tinker_cookbook/recipes/README.md)
- Evaluation: an experimental framework supporting 12 benchmarks (e.g. GSM8K, MMLU-Pro, IFEval, GPQA, AIME 2025/2026) usable as an inline `BenchmarkEvaluator`; README warns scores are configuration-sensitive — [tinker-cookbook repo](https://github.com/thinking-machines-lab/tinker-cookbook)

**Distillation recipe (reproduces the On-Policy Distillation post)**
- Student Qwen3.5-9B-Base, teacher Qwen3.5-9B, LoRA. Stage 1 off-policy SFT on OpenThoughts3: LR 1e-3, batch 128, rank 128, about 65% AIME'24 after 3000 steps. Stage 2 on-policy distillation on DeepMath: LR 1e-4, 512 groups per batch, rank 128, max_tokens 16384, about 76.7% AIME'24 after 200 steps — [distillation recipe README](https://github.com/thinking-machines-lab/tinker-cookbook/tree/main/tinker_cookbook/recipes/distillation)
- Loss is a per-token KL against the teacher on student-generated tokens with no correctness reward (`kl_penalty_coef`), with an optional `kl_discount_factor` the authors say generally does not help; published `tinker://` checkpoints at ranks 8, 32, 128 — [distillation recipe README](https://github.com/thinking-machines-lab/tinker-cookbook/tree/main/tinker_cookbook/recipes/distillation)
- Personalisation variant: SFT on internal documents then on-policy distillation on Tulu3 prompts; IF-eval recovers within about 100 steps — [distillation recipe README](https://github.com/thinking-machines-lab/tinker-cookbook/tree/main/tinker_cookbook/recipes/distillation)
- Multi-turn tool-use distillation: `harbor_multiturn.py` wraps Harbor sandbox tasks (terminal-bench@2.0) and replaces the reward with `zero_reward` so teacher KL is the only signal; environment tokens are masked; example uses Kimi-K2.6 as both roles with max_turns 10, group_size 4, rank 8 — [distillation recipe README](https://github.com/thinking-machines-lab/tinker-cookbook/tree/main/tinker_cookbook/recipes/distillation)
- Multi-teacher distillation: a per-dataset teacher and `groups_per_batch`, batches concatenated; not showcased in the blog post — [distillation recipe README](https://github.com/thinking-machines-lab/tinker-cookbook/tree/main/tinker_cookbook/recipes/distillation)

**SDFT recipe (self-distillation, paper-backed by third parties)**
- Implements "Self-Distillation Enables Continual Learning" (Shenfeld et al., 2026, arXiv 2601.19897): one model is both teacher (sees question plus golden answer in context) and student (sees only the question, generates on-policy). Tinker version uses a top-K=20 forward-KL approximation via `topk_prompt_logprobs` because full-vocabulary logits are not exposed, and a frozen teacher instead of the paper's EMA teacher — [SDFT recipe docs](https://tinker-docs.thinkingmachines.ai/cookbook/recipes/sdft/)
- Results on Qwen3.5-35B-A3B, LoRA rank 64: after tool-use training, SFT lost 9–17 points of science accuracy while SDFT changed by −1.18 to +7.30; SDFT tool-use retention after second-stage training was 94–97% at LR 1e-4 and 5e-4, while SFT at 1e-3 collapsed retention to 12% — [SDFT recipe docs](https://tinker-docs.thinkingmachines.ai/cookbook/recipes/sdft/)
- One Year of Tinker cites SDFT lifting Qwen2.5-7B-Instruct tool-use accuracy from 63.2% (SFT) to 70.6% — [One Year of Tinker](https://thinkingmachines.ai/news/one-year-of-tinker/)

**Prompt distillation recipe**
- Teacher sees a long prompt plus each query and generates responses; student is fine-tuned to produce the same responses without the prompt; example task is 13-way language identification using Qwen3.6-35B-A3B as both roles; cites Askell et al. 2021 (arXiv 2112.00861) and Snell et al. 2022 (arXiv 2209.15189); the README gives no result numbers — [prompt_distillation recipe](https://github.com/thinking-machines-lab/tinker-cookbook/tree/main/tinker_cookbook/recipes/prompt_distillation)

**Customer results cited by TML (self-reported)**
- Bridgewater text-to-SQL model beat Fable 5 and GPT-5.6 Sol on accuracy at 15% of their cost; Sundial's LaTeX-fixing model beat every frontier model except GPT-6 Astra at 7% of Astra's cost; Glean's search agent is about twice as fast with 25% fewer tokens — [One Year of Tinker](https://thinkingmachines.ai/news/one-year-of-tinker/)

### Inferences
- For an outside researcher, the cookbook is the most buildable part of TML's distillation work: on-policy distillation (single-turn, multi-turn tool use, multi-teacher), SDFT and prompt distillation are all runnable, but only through the hosted Tinker API and (by default) only as LoRA adapters. Reproducing them with full fine-tuning or on local hardware requires re-implementing the loop.
- The recipes cover behaviour transfer between existing open models; nothing in Tinker or the cookbook exposes structural compression (expert pruning, loop conversion, native NVFP4 training). Those remain internal to TML's Inkling pipeline.
- The docs/blog mismatch on full fine-tuning suggests it is gated beta rather than a general feature.
- Top-k logprobs (K=20) is the practical constraint on logit-level distillation through Tinker; SDFT's validation suggests top-20 is roughly equivalent to full-vocabulary KL in their tests.

### Gaps
- The cookbook changelog page returned 404 at the URL tried, so I could not date individual recipe additions (e.g. when `sdft`, `harbor_rl`, `true_thinking_score` landed).
- Which models support the full-fine-tuning beta, and its pricing, are not stated publicly in the pages read.
- No reported numbers for the multi-turn Harbor distillation or multi-teacher setups.
- I did not read the individual `harbor_rl`, `rubric`, `true_thinking_score`, or `forecasting` READMEs.

## What arXiv papers or technical reports have TML-affiliated authors published in 2025–2026, and what is arXiv 2610.40325 "How to Loop Your Transformer"?

### Takeaway
TML publishes almost entirely through its own blog rather than arXiv: I found no 2025–2026 arXiv paper with a confirmed TML affiliation for Schulman, Kevin Lu, Weng, Bernstein, Metz or Kirillov. arXiv 2610.40325 "How to Loop Your Transformer" is a FAIR/Meta paper, not a TML paper, and the Inkling 2 Mini post does not cite it.

### Cited Findings

**arXiv 2610.40325 — "How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference"**
- Submitted 29 Oct 2026 (v1). Authors: Chanakya Ekbote, Artidoro Pagnoni, Devendra Singh Sachan, Shruti Bhosale, Mike Lewis, Maryam Fazel-Zarandi, Shashank Rajput, Sujan Kumar Gonugondla — [arXiv abstract](https://arxiv.org/abs/2610.40325)
- Affiliations: all authors FAIR at Meta (Ekbote also MIT, "Work done at FAIR/Meta"); correspondence to a meta.com address; the paper does not mention Thinking Machines Lab or Inkling. Note the author is Devendra Singh Sachan, not TML's Devendra Chaplot — [arXiv HTML v1](https://arxiv.org/html/2610.40325v1)
- Setup: dense decoder-only models trained from scratch, up to 1B parameters, 155B tokens, 32 loops, up to 1.07e21 training FLOPs; metric is DCLM bits-per-byte — [arXiv abstract](https://arxiv.org/abs/2610.40325); [arXiv HTML v1](https://arxiv.org/html/2610.40325v1)
- Findings: looping the full stack gives the best quality at fixed parameter count, while looping a middle block is more efficient when training compute is the constraint; gains from more loops diminish and eventually saturate, regress or destabilise (70M/100M sweeps to L=32); two-loop models at 80 tokens-per-parameter reach a given BPB with fewer FLOPs than vanilla models at 160 — [arXiv abstract](https://arxiv.org/abs/2610.40325); [arXiv HTML v1](https://arxiv.org/html/2610.40325v1)
- Loop-specific low-rank adapters (rank at most 8) help marginally at L=2 and clearly at L=4 and L=8, adding only 1.1–4.3% non-embedding parameters at 300M — [arXiv HTML v1](https://arxiv.org/html/2610.40325v1)
- Parallel inference: looped models slow decoding in proportion to loop count; the original Parallel Loop Transformer does not consistently keep quality; keeping the current-token embedding in every loop's input and applying separate RMSNorm to it and to the previous-token hidden state before combining restores performance; at 1B with L=2 this "Normalized Shifted PLT" beats full-stack looping at every displayed budget — [arXiv HTML v1](https://arxiv.org/html/2610.40325v1)
- No code or weights release mentioned in the portion read (first 100k of about 363k characters) — [arXiv HTML v1](https://arxiv.org/html/2610.40325v1)
- The Inkling 2 Mini post cites Universal Transformers (arXiv 1807.03819), Attention Residuals (Kimi Team, arXiv 2603.15031), and monitorability papers, but not arXiv 2610.40325 — [Inkling 2 Mini post](https://thinkingmachines.ai/news/inkling-2-mini/)

**Papers with a TML-linked author**
- arXiv 2512.02010 "Four Over Six: More Accurate NVFP4 Quantization with Adaptive Block Scaling", Jack Cook, Junxian Guo, Guangxuan Xiao, Yujun Lin, Keith Wyss, Mahdi Nazemi, Asit Mishra, Carlo del Mundo, Tijmen Blankevoort, Song Han; v1 2025-12-01, v5 2026-05-09. Scales some blocks to smaller FP4 values so representable values are more evenly spaced; in pretraining experiments on the Nemotron 3 Nano 30B-A3B architecture, loss ends closer to BF16 than prior NVFP4 recipes; code at github.com/mit-han-lab/fouroversix. Affiliations are not shown on the abstract page — [arXiv 2512.02010](https://arxiv.org/abs/2512.02010)
- Jack Cook is the lead author of TML's End-to-End 4-Bit Training post, which applies 4/6 to activations in Inkling 2 Small training — [4-bit post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)

**Papers done on Tinker "in collaboration with" TML (not TML-authored)**
- arXiv 2603.20004 (ReViSQL), authors Yuxuan Zhu, Tengjun Jin, Yoojin Choi, Daniel Kang; submitted 2026-03-20; no TML authors listed — [arXiv 2603.20004](https://arxiv.org/abs/2603.20004)

**Third-party papers TML explicitly builds on in 2026 launches**
- On-policy self-distillation: Zhao et al. 2026 (arXiv 2601.18734) and Shenfeld et al. 2026 (arXiv 2601.19897), cited in the Inkling 2 Small post — [Inkling 2 Small post](https://thinkingmachines.ai/news/inkling-2-small/)
- Low-precision training: NVIDIA "Pretraining LLMs with NVFP4" (arXiv 2509.25149), MXFP8 recipes (arXiv 2506.08027), TetraJet-v2 (arXiv 2510.27527), Quartet II (arXiv 2601.22813), DeepSeek-V4 (arXiv 2606.19348), Composer 2 technical report (arXiv 2603.24477) — [4-bit post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)

**Papers that cite TML rather than come from it**
- A targeted search for TML-affiliated 2026 arXiv papers by Schulman, Kevin Lu or Bernstein returned only third-party papers citing the On-Policy Distillation blog post, e.g. arXiv 2610.10623 "Recurrent Self-Improvement: Dynamic Cross-Loop On-Policy Distillation for Looped Language Models" (Yi Wang et al., Oct 2026; LoopOPD on Ouro-Thinking models; no TML or Inkling mention) — [arXiv 2610.10623](https://arxiv.org/abs/2610.10623)

### Inferences
- The premise that 2610.40325 is a TML paper is wrong. It is nonetheless the closest public, paper-level treatment of the design space Inkling 2 Mini sits in (middle-block looping, loop-count saturation), and its "loop the middle block when training compute is limited" finding matches TML's choice of looping the middle 12 of 24 layers. The match is circumstantial; TML does not cite it.
- TML's only paper-backed compression component is Four Over Six, and that paper appears to originate from MIT Han Lab with NVIDIA-side coauthors (inferred from the repo location and the coauthor list; the abstract page shows no affiliations) rather than from TML as an institution.
- For citation purposes, TML's methods should be referenced as blog posts (the Connectionism posts carry BibTeX and DOIs such as 10.64434/tml.20250926 for Modular Manifolds), not as peer-reviewed work.

### Gaps
- I could not confirm any 2025–2026 arXiv, OpenReview or conference paper carrying a Thinking Machines Lab affiliation for the named staff; searches were title/abstract-level, and arXiv abstract pages do not show affiliations, so some may exist undetected. Google Scholar and OpenReview author pages were not checked individually.
- Jack Cook's affiliation history (MIT, NVIDIA, TML) and whether 4/6 v4–v5 list TML were not verified.
- Whether TML staff presented at NeurIPS 2025 or ICML 2026 (talks, workshops) was not found.
- Only the first ~100k characters of the 2610.40325 HTML were read; later sections (appendices, any code statement) were not.

## What have TML researchers said in talks, podcasts, interviews and X threads during 2026 about their training philosophy for small models?

### Takeaway
I found no 2026 podcast or long-form interview in which a named TML researcher explains the small-model training philosophy; the public record consists of company blog posts, official X posts, and model cards. The stated philosophy, in TML's own published words, is that expertise belongs in the training signal and in the weights, that customisation by fine-tuning is the company thesis, and that models of different sizes should come from similar recipes with predictable scaling.

### Cited Findings
- Company thesis in its own words: "For organizations and individuals to align AI to their own values, these values must be encoded in the model weights."; tools should "enable everyone to fine-tune models with their unique knowledge" — [The Future Worth Building Is Human, 2026-07-10](https://thinkingmachines.ai/blog/the-future-worth-building-is-human/)
- "Putting task expertise into task-specific training is ultimately what scales." (argued against agentic scaffolding pipelines) — [Putting Task Expertise into RL, 2026-08-27](https://thinkingmachines.ai/news/putting-task-expertise-into-rl/)
- Customisation claim: "a custom model that pushes far beyond the cost-performance frontier on the given task" is achievable with upfront investment in expertise and data — [One Year of Tinker, 2026-10-15](https://thinkingmachines.ai/news/one-year-of-tinker/)
- LoRA as default rationale: LoRA matches full fine-tuning for RL even at rank 1 because RL supplies few bits per episode — [LoRA Without Regret](https://thinkingmachines.ai/blog/lora/); restated in the docs — [Tinker docs overview](https://tinker-docs.thinkingmachines.ai/tinker/)
- On RL and alignment: "Without proper attention to alignment, capabilities-focused RL can push models to succeed at any cost."; and on the size ladder: "train models at different sizes using similar recipes with predictable scaling" — [Inkling 2 Small post, 2026-11-05](https://thinkingmachines.ai/news/inkling-2-small/)
- Distil then RL, in practice: Inkling-Small's preview checkpoint used on-policy distillation with Inkling as teacher, after which "we continued scaling agentic coding RL for two weeks", ending above the teacher on SWE-bench Verified (80.2% vs 77.6%) — [Inkling-Small post, 2026-07-30](https://thinkingmachines.ai/news/inkling-small/)
- On-policy distillation as a regulariser inside RL with a self-promoted teacher (not as a replacement for RL) — [Financial tasks post, 2026-06-30](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)
- Native low precision: the end-to-end recipe "eliminates the need for calibration when a quantized checkpoint is delivered at the end of training" — [4-bit post, 2026-11-13](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- Looping, official X post: "Inkling 2 Mini is a looped transformer with 24 layers. The middle 12 layers loop three times; the first and last six run once. Looping lets a model reason more while writing less, which has raised concerns about monitorability. We studied this as part of our release." — [@thinkymachines on X, 2026-11-20](https://x.com/thinkymachines/status/2123871645039464643)
- Official X post on size: "Some of you thought that Inkling 2 Small was too big at 594B parameters. We heard you: Inkling 2 Mini is a looped transformer with just 26B parameters, small enough to run on your laptop, powerful enough for agentic work with a score of 20.1 on AA Index." — [@thinkymachines on X, 2026-11-20](https://x.com/thinkymachines/status/2123871643797995872)
- The Inkling 2 Mini post states the pipeline (expert pruning, healing on about 1T distilled tokens, RL totalling 2.2T tokens over 2,000 steps) but, in the summary obtained, gives no explicit rationale for RL over distillation alone — [Inkling 2 Mini post](https://thinkingmachines.ai/news/inkling-2-mini/)
- UNVERIFIED second-hand quote: a DEV Community article attributes to TML researcher @cHHillee the statement that "more than 10% of one researcher (and his agents) for a couple weeks" drove most of the Inkling 2 Mini training, linking x.com/cHHillee/status/2123872762129428651; the original post was not retrieved — [DEV Community article](https://dev.to/max_quimby/inkling-2-mini-runs-on-your-macbook-heres-why-that-matters-45d5)
- Press: TechCrunch's Inkling article contains no direct quotes from named TML staff; it frames the release as support for the thesis that organisation-adapted AI will beat one-size-fits-all models, and reports about 200 employees after departures including two co-founders who left for OpenAI — [TechCrunch, 2026-07-15](https://techcrunch.com/2026/07/15/thinking-machines-amps-up-its-bet-against-one-size-fits-all-ai-with-its-first-open-model-inkling/)
- Podcast coverage found is third-party analysis only (IBM "Mixture of Experts" episode on the Inkling release, 2026-07-17), with no TML researcher as guest — [Apple Podcasts listing](https://podcasts.apple.com/us/podcast/thinking-machines-lab-drops-inkling-metas-muse-spark-1-1/id1743817188?i=1000777196236)
- Chinese-language coverage (17173, AIHOT) restates the launch post (expert pruning from 384 to the 128 most-used experts per layer, 1T-token distillation healing, middle blocks looped three times) and adds no independent researcher statements — [17173 news](https://news.17173.com/content/11232026/153237659.shtml); [AIHOT](https://aihot.news/items/y7nk77dxae51qwi826gpmvbho)

### Inferences
- TML's revealed philosophy for small models, pieced together from posts rather than stated in one place: (1) distillation is a bootstrap or a regulariser, and RL does the remaining work, because a distilled student can then exceed its teacher on reasoning and coding (Inkling-Small); (2) the same recipe is applied across a size ladder; (3) the deployment numeric format is used during training; (4) structural compression (pruning) is followed by distillation "healing" from a larger internal model. Points 1–3 are directly supported by TML text; the causal "why RL instead of only distilling" argument is my reading, not a TML quote.
- The absence of interviews means claims about TML researchers' personal views on pruning-plus-healing or looping should be attributed to company posts, not individuals.

### Gaps
- No 2026 talk, podcast or interview transcript from Schulman, Murati, Weng, Kevin Lu, Bernstein, Horace He or others on small-model training was found in two extended searches (English) and two Chinese-language searches. X is poorly indexed, so individual researcher threads may exist that I could not retrieve.
- The identity behind @cHHillee is, from prior knowledge, Horace He, but the article does not say so and I did not verify the post.
- Which co-founders left and how that affects research direction is reported only at headline level by TechCrunch.

## Which methods have open code or open weights, and under what licence?

### Takeaway
Open weights exist for all four Inkling generations plus the variable-loop research model, with Apache 2.0 stated on the model cards together with a separate Model Acceptable Use Policy; open code is limited to Tinker client tooling and recipes (Apache-2.0) and two small research repos (MIT). The training code, kernels and pipelines behind pruning, healing, looping and 4-bit training are not released.

### Cited Findings

**Weights (Hugging Face org `thinkingmachines`, 10 model repos, no public datasets)**
- Repos: TML-d24-varloop-research (26B), Inkling-2-Mini (26B), Inkling-2-Small (594B), Inkling-2-Small-MXFP8 (612B), Inkling-Small (266B), Inkling-Small-NVFP4, Inkling-NVFP4, Inkling (952B), plus two Llama-3 tokenizer repos — [HF org page](https://huggingface.co/thinkingmachines)
- Inkling-2-Mini model card: "License: Apache 2.0", subject to the Model Acceptable Use Policy; 26.4B total, 3.4B active per token (about 5.4B effective with three passes); single ~20GB checkpoint "in mixed NVFP4 and MXFP8 precisions"; runs on one DGX Spark or a 32GB Apple-silicon machine — [Inkling-2-Mini model card](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- TML-d24-varloop-research model card: "License: Apache 2.0" plus Acceptable Use Policy; released 2026-11-20; 24-layer MoE with the middle 12 layers run a variable number of times with shared weights; 8 of 128 experts per layer; NVFP4 for expert layers, MXFP8 for the last four layers, BF16 elsewhere; weights-only, not on Tinker — [varloop model card](https://huggingface.co/thinkingmachines/TML-d24-varloop-research)
- Varloop training: shares pretraining and the first stage of midtraining with Inkling 2 Mini; "For the rest of midtraining, it was trained with 1 to 5 passes through the looped layers, sampled in a 1:2:6:2:1 ratio."; then post-trained with 3 passes; "We do not intend TML-d24-varloop-research for production use." — [varloop model card](https://huggingface.co/thinkingmachines/TML-d24-varloop-research)
- Varloop results by pass count (1/2/3/4/5): SWE-bench Verified 56.3/76.5/78.7/79.3/79.6%; GPQA Diamond 69.6/79.2/84.2/81.9/83.1%; BrowseComp 29.4/53.8/65.7/69.4/71.0%; HLE text-only 10.5/20.0/24.9/25.4/25.9%; MRCR v2 8-needle 256K–512K 26.2/65.2/89.2/93.4/92.1%; each extra pass adds about 1.0B active parameters per token. Inkling 2 Mini (fixed 3 passes) scores 79.2% SWE-bench Verified and 86.6% GPQA Diamond — [varloop model card](https://huggingface.co/thinkingmachines/TML-d24-varloop-research)
- Inkling model card: metadata "License: apache-2.0", Acceptable Use link, BF16 weights with a separate NVFP4 repo — [Inkling model card](https://huggingface.co/thinkingmachines/Inkling)
- Inkling 2 Small: launched 2026-11-05 with closed weights on Tinker and a stated intent to "make the full weights available under an Apache 2.0 license"; an update dated 2026-11-12 says the weights are downloadable on Hugging Face — [Inkling 2 Small post](https://thinkingmachines.ai/news/inkling-2-small/)
- Inkling-Small: "We are releasing the full weights of Inkling-Small." — [Inkling-Small post](https://thinkingmachines.ai/news/inkling-small/); VentureBeat reports an Apache 2.0 licence (second-hand; via search snippet) — [VentureBeat](https://venturebeat.com/technology/thinking-machines-debuts-inkling-small-open-source-ai-model-nearing-performance-of-predecessor-at-about-1-4-size)
- Inference/runtime support named on the model card: Transformers, SGLang, vLLM, TokenSpeed, NVIDIA Dynamo, Unsloth, llama.cpp (GGUF), Ollama, Exo — [varloop model card](https://huggingface.co/thinkingmachines/TML-d24-varloop-research)

**Code (GitHub org `thinking-machines-lab`, 10 public repos)**
- `tinker-cookbook` (Apache-2.0, 4.3k stars, updated 2026-11-20); `tinker` SDK and CLI (Apache-2.0, updated 2026-11-18); `inkling-verify` (Apache-2.0, 2026-11-09); `batch_invariant_ops` (MIT, 2025-11-04); `manifolds` (MIT, 2025-09-26); `tinker-challenge`, `tinker-feedback`, `tinker-project-ideas` (no licence listed); forks `lws` and `redis-rs` — [GitHub org listing](https://github.com/orgs/thinking-machines-lab/repositories)
- Related non-TML open code: Four Over Six at github.com/mit-han-lab/fouroversix — [arXiv 2512.02010](https://arxiv.org/abs/2512.02010); ReViSQL code and BIRD-Platinum / Arcwise-Plat-SQL datasets at github.com/uiuc-kang-lab/ReViSQL — [text-to-SQL post](https://thinkingmachines.ai/news/putting-task-expertise-into-rl/)
- Not released: 4-bit training kernels (BBBK) or recipe code — [4-bit post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/); interaction-model weights or training code — [Interaction Models post](https://thinkingmachines.ai/blog/interaction-models/); financial-task and forecasting model weights — [financial tasks post](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/), [forecasting post](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)
- Third-party derivative to be aware of: `tbmod/Inkling-mini-*` on Hugging Face are unofficial layer-and-expert truncations of Inkling that output gibberish and are unrelated to Inkling 2 Mini (per search-result description) — [tbmod/Inkling-mini-bf16](https://huggingface.co/tbmod/Inkling-mini-bf16)

**Documentation-quality summary: what is buildable**
- Reproducible with released code: batch-invariant kernels (MIT); manifold Muon toy experiments (MIT); on-policy / multi-teacher / multi-turn distillation, SDFT, prompt distillation, RL loops and evals (Apache-2.0 cookbook, requires Tinker API); ReViSQL (third-party repo + paper) — [GitHub org listing](https://github.com/orgs/thinking-machines-lab/repositories); [recipes README](https://github.com/thinking-machines-lab/tinker-cookbook/blob/main/tinker_cookbook/recipes/README.md)
- Described in enough detail to re-implement but without code: LoRA hyperparameter guidance — [LoRA post](https://thinkingmachines.ai/blog/lora/); CISPO + interleaved batching + self-promoted-teacher OPD — [financial tasks post](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/); NVFP4 forward / MXFP8 backward data flow — [4-bit post](https://thinkingmachines.ai/blog/end-to-end-4-bit-training/)
- Artifact-only (weights without method code): loop-count sampling schedule 1:2:6:2:1 and the variable-loop checkpoint — [varloop model card](https://huggingface.co/thinkingmachines/TML-d24-varloop-research)

### Inferences
- The variable-loop weights are the single most useful open artifact for researchers studying looped small models: they allow direct measurement of capability versus loop count (strong gains 1→3 passes, plateau or noise beyond), and Apache 2.0 permits fine-tuning and redistribution subject to the Acceptable Use Policy. The card's own caveat (3 passes dominated training, so other counts are understated) limits conclusions about optimal loop count.
- The varloop table independently echoes the FAIR paper's finding that loop gains saturate, and shows knowledge-heavy and reasoning-heavy benchmarks respond differently, but the two results come from different organisations and model scales.
- Because the checkpoints ship natively in NVFP4/MXFP8, downstream users on non-Blackwell hardware depend on runtime support (llama.cpp GGUF, Transformers) for conversion; fidelity of those conversions is not documented in the pages read.
- The Apache 2.0 licence plus a separate Acceptable Use Policy is a combination worth a legal read before commercial reuse; I did not read the policy text.

### Gaps
- The Model Acceptable Use Policy text was not fetched, so its restrictions (and how it interacts with Apache 2.0) are not characterised.
- Licence statements for Inkling-Small, Inkling-2-Small and the NVFP4/MXFP8 variant repos were not individually verified on their model cards (the org page shows no licence column); Apache 2.0 is confirmed directly only for Inkling, Inkling-2-Mini and TML-d24-varloop-research.
- The varloop card does not show how to set the pass count at inference time.
- `inkling-verify` has no description on the org page; its purpose was not checked.
- No training code for expert pruning, healing distillation, or loop conversion has been released, and I found no statement that it will be.
