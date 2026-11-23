# Academic work (2025 – Nov 2026) on distilling long-horizon agentic capability from large LLMs into small language models

Reader notes on provenance (applies to every section):
- All numbers below were read from the primary source named in the link (arXiv abstract/HTML page, or the author's blog). They are self-reported by the papers' authors unless stated otherwise; almost none have been independently reproduced.
- Pages were read through an extraction tool; several arXiv HTML pages were truncated at ~100k characters, so appendix-only numbers may be missing. Items read only at abstract level are marked "(abstract only)".
- Model names such as Qwen3.5 / Qwen3.6 / GLM-5 / Kimi-K2.6 / DeepSeek-V4 / GPT-5.5 / "GPT 5.6 Sol" / Claude Opus 4.6 are reproduced exactly as written in the cited 2026 papers.
- Cross-paper comparisons mix scaffolds, context limits, benchmark versions (Terminal-Bench 1.0 / 2.0 / 2.1 / Lite; tau-bench vs TAU-2), and seeds. Treat cross-paper deltas under ~3 points as noise (SERA measured a median run-to-run std of 1.2% on SWE-bench Verified; Terminal-Bench 2.0 error bars are about ±2–3 points).

---

## Q1. What are the most influential 2025–2026 papers, and what is each one's core method?

### Takeaway
The field moved from "SFT on teacher reason-act-observe traces" (Agent Distillation, NeurIPS 2025) to three 2026 clusters: (a) large-scale trajectory-distillation data engines for coding/terminal agents (SWE-Lego, SERA, Scale-SWE, Open-SWE-Traces, Nemotron-Terminal, Terminal-Lego, CLI-Universe), (b) student-centred / on-policy correction methods (SCoRe, DAgger-for-agents, SOD, UOPD, TurnOPD and ~10 sibling OPD papers from May–Sep 2026), and (c) RL on synthetic environments, with or without an SFT warm start (WebExplorer, SynthAgent, Tmax, CANOPY, SWE-Protégé, ToolOrchestra). I could not verify citation counts, so "influential" here means "repeatedly used as a baseline or anchor by later papers".

### Cited Findings

**A. Trajectory / behaviour distillation from teacher agents (SFT on teacher traces)**

- **Agent Distillation** — "Distilling LLM Agent into Small Models with Retrieval and Code Tools", Minki Kang (KAIST/KRAFTON), Jongwon Jeong (UW-Madison), Seanie Lee (KAIST), Jaewoong Cho (KRAFTON), Sung Ju Hwang (KAIST/DeepAuto.ai). arXiv 2505.17612, v1 23 May 2025, v2 5 Nov 2025; NeurIPS 2025 main track. Method: SFT of 0.5B–7B Qwen2.5 students on reason-act-observe trajectories from a Qwen2.5-32B teacher using retrieval and code tools, plus a "first-thought prefix" (ftp) prompt to improve teacher trajectories and test-time "self-consistent action generation" (sag). Trained on only 1,000 HotPotQA + 2,000 MATH examples. — [arXiv 2505.17612v2](https://arxiv.org/html/2505.17612v2); [NeurIPS 2025 proceedings](https://papers.neurips.cc/paper_files/paper/2025/hash/99263f9bf46874e2b8b7f104b5063864-Abstract-Conference.html)
- **mini-coder** — Ricardo Dominguez-Olmedo (Max Planck Institute for Intelligent Systems, Tübingen), blog dated 30 Sep 2025 (no arXiv paper found). Method: plain SFT of Qwen3 1.7B and 4B on 400k trajectories (~5.5B tokens) from a Qwen3-Coder-30B-A3B teacher on SWE-smith issues with the mini-swe-agent scaffold. — [mini-coder blog](https://rdolmedo.github.io/blogs/minicoder.html)
- **SWE-Lego** — "SWE-Lego: Pushing the Limits of Supervised Fine-tuning for Software Issue Resolving", Chaofan Tao, Jierun Chen, Yuxin Jiang, … Haoli Bai (Huawei-affiliated per the sibling Terminal-Lego paper; affiliations not shown on the abstract page). arXiv 2601.01426, 4 Jan 2026. Method: SFT-only recipe on ~32k task instances / ~18k validated trajectories (real + synthetic), with error masking and a difficulty-based curriculum, plus a trained verifier for test-time scaling. — [arXiv 2601.01426](https://arxiv.org/abs/2601.01426)
- **SERA** — "SERA: Soft-Verified Efficient Repository Agents", Ethan Shen, Daniel Tormoen, Saurabh Shah, Ali Farhadi, Tim Dettmers (Allen Institute for AI / UW / CMU). arXiv 2601.20789, v2 2 Feb 2026. Method: "Soft Verified Generation" — the teacher (GLM-4.5-Air or GLM-4.6) makes a change from a vague prompt, the trajectory is turned into a synthetic PR, a second teacher rollout solves that PR, and the two patches are compared by line-level recall; no unit tests or execution environments are needed. SFT only. — [arXiv 2601.20789v2](https://arxiv.org/html/2601.20789v2)
- **Scale-SWE** — "Immersion in the GitHub Universe: Scaling Coding Agents to Mastery", Jiale Zhao, … Kai Jia (Renmin University Gaoling School of AI; BandAI, ByteDance; AweAI). arXiv 2602.09892, 10 Feb 2026 (v4 24 Mar 2026). Method: multi-agent pipeline builds 100k verified Python task instances from 5.2k repos; DeepSeek-V3.2 teacher produces 71,498 test-passing trajectories (~3.5B tokens); SFT into Qwen3-30B-A3B-Instruct. — [arXiv 2602.09892](https://arxiv.org/html/2602.09892)
- **Open-SWE-Traces** — "Open-SWE-Traces: Advancing Dual-Mode Multilingual Distillation for Software Engineering Agents", Wasi Uddin Ahmad, Nikolai Ludwig, Somshubra Majumdar, Boris Ginsburg (NVIDIA). arXiv 2606.16038, 14 Jun 2026. Method: 207,489 trajectories over nine languages from two teachers (MiniMax-M2.5 thinking traces; Qwen3.5-122B-A10B non-thinking traces), two-stage filtering plus an AST scanner that removes "git hacking" trajectories; SFT into Qwen3-Coder-30B-A3B. — [arXiv 2606.16038](https://arxiv.org/html/2606.16038)
- **Nemotron-Terminal** — "On Data Engineering for Scaling LLM Terminal Capabilities", Renjie Pi, Grace Lam, Mohammad Shoeybi, Pooya Jannaty, Bryan Catanzaro, Wei Ping (NVIDIA). arXiv 2602.21193, 24 Feb 2026; listed as a NeurIPS 2026 poster. Method: Terminal-Task-Gen = dataset adapters (226,313 samples) + seed-/skill-based synthetic tasks (264,207 samples), trajectories from a DeepSeek-V3.2 teacher in Docker with Terminus 2; SFT into Qwen3 8B/14B/32B. — [arXiv 2602.21193](https://arxiv.org/html/2602.21193v1); [NeurIPS 2026 listing](https://neurips.cc/virtual/2026/poster/139269)
- **TermiGen** — "TermiGen: High-Fidelity Environment and Robust Trajectory Synthesis for Terminal Agents", Kaijie Zhu, Yuzhou Nie, … Wenbo Guo (UCSB, UCSD, AMD, Oxford, Google). arXiv 2602.07274, 6 Feb 2026. Method: synthesizes 3,500+ verified Docker environments; a Generator-Critic injects errors with probability 0.2 per step (five failure modes) so the Claude-4.5-Sonnet teacher demonstrates diagnosis and recovery; SFT into 32B students. — [arXiv 2602.07274](https://arxiv.org/html/2602.07274v1)
- **Terminal-Lego** — "What Makes Interaction Trajectories Effective for Training Terminal Agents?", Sidi Yang (HKU), Chaofan Tao (Huawei), … Haoli Bai (Huawei). arXiv 2606.03461, 2 Jun 2026. Method: controlled study holding harness (Terminus-2) and data volume fixed while varying the teacher (DeepSeek-V3.2, Claude Opus 4.6, Qwen3.5-Plus, GLM-5); introduces "environment-grounded supervision" measured by a trajectory observation ratio (TOR). — [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- **CLI-Universe** — Zhanbo Hua, … Jiaheng Liu (Nanjing University, StepFun, ZODA, Shanghai AI Lab, HUST). arXiv 2606.22883, 22 Jun 2026. Method: task-synthesis engine with a capability taxonomy, deep-research grounding and multi-stage verification (about two-thirds of candidates discarded); 6k Kimi-K2.6 trajectories; SFT into Qwen3 8B/14B/32B. — [arXiv 2606.22883](https://arxiv.org/html/2606.22883)
- **Meta-Task** (abstract only) — Zhihong Pan et al., arXiv 2607.27929, 30 Jul 2026. Method: treats task synthesis itself as a Terminal-Bench-format task done by an agent inside a real container; 3,221 synthesized trajectories. — [arXiv 2607.27929](https://arxiv.org/abs/2607.27929)
- **Fara-7B** — "Fara-7B: An Efficient Agentic Model for Computer Use", Ahmed Awadallah et al. (Microsoft). arXiv 2511.19663, 24 Nov 2025. Method: FaraGen multi-agent pipeline (Magentic-One Orchestrator + WebSurfer on o4-mini / o3 / GPT-5, plus LLM verifiers) generates 145,603 verified web trajectories (1,010,797 steps) at $0.59–$1.08 each; SFT only into Qwen2.5-VL-7B, pixel-in / coordinate-out. — [arXiv 2511.19663](https://arxiv.org/html/2511.19663)

**B. On-policy distillation / DAgger-style correction**

- **SCoRe** — "Student-Centered Distillation Narrows the Agentic Gap Between Small and Large LLMs" (earlier title "From Correction to Mastery: Reinforced Distillation of Large Language Model Agents"), Yuanjie Lyu, Chengyu Wang, Jun Huang, Tong Xu (USTC). arXiv 2509.14257 (v1 Sep 2025, v3 Jul 2026); ICML 2026 (PMLR v306). Method: the student generates full trajectories, the teacher corrects only the earliest erroneous step, the student resumes; then short-horizon GRPO starting from the verified prefix with a key-step reward. — [arXiv 2509.14257v3](https://arxiv.org/html/2509.14257v3); [PMLR listing](https://proceedings.mlr.press/v306/lyu26j.html)
- **Revisiting DAgger in the Era of LLM-Agents** — Changhao Li, Rushi Qiang, Jiawei Huang, Chenxiao Gao, Chao Zhang, Niao He, Bo Dai (Georgia Tech; ETH Zurich). arXiv 2605.12913, 13 May 2026. Method: turn-level mixture of student and teacher actions during rollouts (teacher takes a turn with probability β, decayed 1.0 → 0.6), teacher relabels every visited state, cross-entropy training; works with black-box teachers. Also an AggreVaTe-style variant (student prefix, teacher completes). — [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)
- **SOD** — "SOD: Step-wise On-policy Distillation for Small Language Model Agents", Qiyong Zhong, Mao Zheng, Mingyang Song, … Junfeng Fang (Zhejiang University, Tencent, USTC, NUS). arXiv 2605.07725, 8 May 2026. Method: GRPO + white-box on-policy distillation where each reasoning step's KL loss is reweighted by student–teacher divergence, down-weighting steps after a tool error. — [arXiv 2605.07725](https://arxiv.org/html/2605.07725v1)
- **UOPD** — "UOPD: Uncertainty-Aware Intervention for On-Policy Distillation of Multi-Turn Agents", Wenbo Zhang, Pengcheng Xu, Jing Zhang, Hengrui Cai (UC Irvine), Weizhi Du (U. Michigan). arXiv 2609.34036, 27 Sep 2026. Method: on turns where the teacher has low confidence in the student's proposed action, the teacher's action is executed and trained with SFT; other turns use reverse-KL OPD; intervention rate decays 30% → 5%. — [arXiv 2609.34036](https://arxiv.org/html/2609.34036v1)
- **TurnOPD** (abstract only) — Yuhang Zhou et al., arXiv 2607.05804, 7 Jul 2026 (v2 28 Sep 2026). Method: adaptive rollout-depth budgeting and turn-normalized KL weighting, because full-length rollouts spend compute on tail turns with weak supervision and trajectory-level KL concentrates on early tokens. — [arXiv 2607.05804](https://arxiv.org/abs/2607.05804)
- **SDAR** (abstract only) — "Self-Distilled Agentic Reinforcement Learning", Zhengxi Lu, … Yongliang Shen. arXiv 2605.15155, 14 May 2026. Method: RL stays the backbone; on-policy self-distillation from a privileged-context teacher branch is a sigmoid-gated auxiliary loss. — [arXiv 2605.15155](https://arxiv.org/abs/2605.15155)
- **"Your Teacher Can't Help You Here"** (abstract only) — Yanjiang Liu, … Yaojie Lu. arXiv 2605.30833, 29 May 2026. Identifies "Supervision Fidelity Decay" and proposes a Lookahead Group Reward. — [arXiv 2605.30833](https://arxiv.org/abs/2605.30833)
- **A Survey of On-Policy Distillation for Large Language Models** — Mingyang Song, Mao Zheng (Tencent). arXiv 2604.00626, 1 Apr 2026. — [arXiv 2604.00626](https://arxiv.org/html/2604.00626v1)
- The UOPD paper lists a further cluster of 2026 multi-turn-agent OPD papers that I did not read: TCOD (temporal curriculum; COLM 2026), Prune-OPD (2605.07804), SAGE-OPD (2606.19659), prefix-replay OPD (2607.04763), trajectory-refined distillation (2606.08432), selective hindsight distillation (2605.19447), ADWIN (2605.28396), "Are full rollouts necessary for OPD?" (2605.31490), curriculum turn-level guidance (2606.15912), FTB-OPD "Look ahead before you distill" (2608.01953). — [arXiv 2609.34036](https://arxiv.org/html/2609.34036v1)
- **MENTOR** (abstract only) — ChangSu Choi et al., arXiv 2510.18383 (v1 21 Oct 2025, v4 27 Aug 2026). Method: RL where the teacher's reference trajectory shapes a flexible, process-aware reward instead of being an imitation target. — [arXiv 2510.18383](https://arxiv.org/abs/2510.18383)

**C. RL fine-tuning of small models on multi-step environments (with or without teacher)**

- **WebExplorer** — "WebExplorer: Explore and Evolve for Training Long-Horizon Web Agents", Junteng Liu (HKUST), … Pengyu Zhao (MiniMax), Wenhu Chen (Waterloo), Junxian He (HKUST). arXiv 2509.06501, v3 26 Sep 2025. Method: synthesize ~40K hard QA pairs by model-based exploration and "long-to-short" query evolution; SFT cold start on ~13K rejection-sampled trajectories from a commercial model, then GRPO on ~12K samples; Qwen3-8B with 128K context and up to 100 tool calls. — [arXiv 2509.06501v3](https://arxiv.org/html/2509.06501v3)
- **SynthAgent** — "Mock Worlds, Real Skills: Building Small Agentic Language Models with Synthetic Tasks, Simulated Environments, and Rubric-Based Rewards", Yuanjie Lyu, Chengyu Wang, Lei Shen, Jun Huang, Tong Xu (USTC, Xi'an Jiaotong). arXiv 2601.22511 (v2 12 Mar 2026); ACL 2026 long paper per the ACL Anthology listing. Method: a Qwen3-235B teacher writes 15,096 persona-grounded tool-use tasks with virtual tool sets; an LLM user simulator and LLM tool simulator replace real APIs; rubric-based rewards; GRPO on Qwen3-8B/14B. — [arXiv 2601.22511v2](https://arxiv.org/html/2601.22511v2); [ACL Anthology](https://aclanthology.org/2026.acl-long.570/)
- **Tmax** — "Tmax: A simple recipe for terminal agents", Hamish Ivison, Teng Xiao, Junjie Oscar Yin, Rulin Shao, Nathan Lambert, Hannaneh Hajishirzi (Ai2 / UW). arXiv 2606.23321, 22 Jun 2026 (v2 2 Nov 2026). Method: 13,565 synthetic terminal RL environments generated by Gemini-3-Pro and repaired by an LLM judge; outcome-only reward with a GRPO variant (DPPO), RL only for Qwen 3.5/3.6 (no SFT), SFT warm start only for the older Qwen3-8B. — [arXiv 2606.23321](https://arxiv.org/html/2606.23321)
- **CANOPY** (abstract only) — "Explore More, Drift Less: Outcome-Only Reinforcement Learning Can Suffice for Long-Horizon Interactive Agents", Liming Pu et al., arXiv 2609.01245, 1 Sep 2026. Method: scale same-task exploration, KL-anchored on-policy updates, train only on the agent's own action tokens, larger test-time interaction budget. — [arXiv 2609.01245](https://arxiv.org/abs/2609.01245)
- **LiteCoder-Terminal** (abstract only) — Xiaoxuan Peng, … Le Sun. arXiv 2605.29559, 28 May 2026. Method: 11,255 expert trajectories for SFT plus 602 verifiable environments for RL with Direct Multi-turn Preference Optimization. — [arXiv 2605.29559](https://arxiv.org/abs/2605.29559)

**D. Hybrid large-expert / small-executor or small-orchestrator setups**

- **SWE-Protégé** — "SWE-Protégé: Learning to Selectively Collaborate With an Expert Unlocks Small Language Models as Software Engineering Agents", Patrick Tser Jern Kon (U. Michigan, work at Meta), … John Yang (Stanford), Samuel Thompson (Meta). arXiv 2602.22124, 25 Feb 2026. Method: the 7B SLM stays the decision-maker and learns when to call an expert model; Phase I SFT on ~4.8K expert-augmented resolved trajectories (Claude Sonnet 3.7 as expert), Phase II on-policy GRPO-style RL with a loop penalty, follow-through score and expert-as-judge reward. — [arXiv 2602.22124](https://arxiv.org/html/2602.22124v1)
- **ToolOrchestra** — "ToolOrchestra: Elevating Intelligence via Efficient Model and Tool Orchestration", Hongjin Su, Shizhe Diao, … Pavlo Molchanov (NVIDIA; HKU). arXiv 2511.21689, 26 Nov 2025. Method: a Qwen3-8B orchestrator trained with GRPO on synthetic ToolScale environments (10 domains, 4,063 tasks) to decide when to call stronger models and tools, with rewards for correctness, cost/latency and user preferences. — [arXiv 2511.21689](https://arxiv.org/html/2511.21689v1)
- **Plan-and-Act** (2025 foundation) — Lutfi Eren Erdogan et al. (UC Berkeley; U. Tokyo). arXiv 2503.09572 (v3 22 Apr 2025). Method: separately fine-tuned Planner and Executor, synthetic plan data, dynamic replanning. Main models are 70B; also reports an 8B variant. — [arXiv 2503.09572v3](https://arxiv.org/html/2503.09572v3)
- **NVIDIA position paper** — "Small Language Models are the Future of Agentic AI", Peter Belcak, … Pavlo Molchanov (NVIDIA Research; Georgia Tech). arXiv 2506.02153 (v2 15 Sep 2025). A position paper with a six-step LLM-to-SLM conversion procedure (log calls → curate → cluster tasks → select SLM → fine-tune → iterate); it contains no experiments. — [arXiv 2506.02153v2](https://arxiv.org/html/2506.02153v2)

**E. Distilling into latent / recurrent reasoning**

- **ALAR** (abstract only) — "Adaptive Latent Agentic Reasoning", Dongwon Jung, Peng Shi, Yi Zhang, Junshan Zhang, Muhao Chen. arXiv 2606.02871, 1 Jun 2026. Method: dual-mode agent that uses compact latent reasoning on routine turns and explicit chain-of-thought on hard turns, with the agent's actions as supervision anchors for the latent mode. — [arXiv 2606.02871](https://arxiv.org/abs/2606.02871)

### Inferences
- Agent Distillation (2505.17612) is the conceptual anchor for the whole area, but its benchmarks are short multi-hop QA and math (a handful of tool calls), not long-horizon work. The 2026 literature that matters for long horizons is the SWE-bench / Terminal-Bench / deep-search cluster.
- The centre of gravity in 2026 is data engineering (task and environment synthesis plus teacher rollouts), not new loss functions. Most headline numbers come from plain SFT on 3k–490k teacher trajectories.
- The OPD cluster (SOD, UOPD, TurnOPD and siblings) is mostly evaluated on short environments (ALFWorld, WebShop, multi-hop search, AIME-style code-interpreter math). Only the DAgger paper tests on-policy correction on a genuinely long-horizon benchmark (SWE-bench Verified).
- Latent/recurrent reasoning distillation for agents is nearly empty: one abstract-level paper (ALAR) that targets token efficiency, not small-model capability.

### Gaps
- I could not verify citation counts for any paper, so the ranking of "most cited" is not established.
- Not read in full: TurnOPD, SDAR, ALAR, MENTOR, CANOPY, Meta-Task, LiteCoder-Terminal, and the ten sibling OPD papers listed by UOPD. Their methods are summarized from abstracts or from another paper's related-work section.
- I found no 2026 follow-up by the NVIDIA position-paper authors that adds experiments; the closest items are two surveys (arXiv 2510.03847, Oct 2025, and a Jan 2026 Preprints.org survey), neither of which I read. — [search result listing](https://arxiv.org/abs/2510.03847)
- Baselines frequently cited by these papers but not read here: SWE-smith / SWE-agent-LM, R2E-Gym, SkyRL-Agent, DeepSWE, Kimi-Dev, SWE-Dev, KAT-Dev, BugPilot/FrogBoss, TerminalTraj, SkillSynth, CalibForge, SETA, Endless Terminals, OpenThinker-Agent, WebSailor, WebShaper, OffSeeker, Marco DeepResearch.
- Computer-use on OSWorld: I found titles only (LearnWeak arXiv 2605.28775 reporting +11.6 points on EvoCUA-8B and +11.1 on OpenCUA-7B; Watch & Learn arXiv 2510.04673). Numbers come from search snippets, not the papers. — [arXiv 2605.28775](https://arxiv.org/html/2605.28775v1)

---

## Q2. Concrete results: student size, teacher, benchmark, and gap closed versus the teacher

### Takeaway
Distilled students in the 8B–32B range now reach 30–64% on SWE-bench Verified and 11–33% on Terminal-Bench 2.0, but where a like-for-like teacher number exists the student usually stays 6–20+ points behind (for example 61.7 vs 80.2, 26.8 vs 33.2, 24.3 vs 39.3). Students match or beat the teacher only in narrow settings: short-horizon QA/math (SCoRe), single-repository specialization (SERA), or when the "small" model is allowed to call a large one (SWE-Protégé, ToolOrchestra).

### Cited Findings

**SWE-bench Verified (resolve rate, %)**

| Paper (date) | Student | Teacher | Training | Student result | Teacher / reference |
|---|---|---|---|---|---|
| mini-coder (Sep 2025) | Qwen3 1.7B | Qwen3-Coder-30B-A3B | SFT, 400k traj | 18.6 (pass@100 50.4) | teacher 33.2 |
| mini-coder (Sep 2025) | Qwen3 4B | same | SFT, 400k traj | 26.8 (pass@100 60.2); base 4.0 | teacher 33.2 (pass@100 67.4) |
| DAgger revisit (May 2026) | Qwen3-4B | Qwen3-Coder-30B-A3B | DAgger-style, SWE-Gym 2,338 tasks | 27.3 (base 11.2, SFT 22.9, OPD 23.4, GRPO 11.6) | teacher score not extracted |
| DAgger revisit (May 2026) | Qwen3-8B | same | same | 29.8 (base 7.7, SFT 23.4, OPD 26.2, GRPO 8.2) | — |
| SERA (Jan 2026) | Qwen3-8B | GLM-4.6 | SFT | 31.7 ±0.9 (32K ctx) | GLM-4.6 60.8 |
| SERA (Jan 2026) | Qwen3-32B | GLM-4.6 | SFT | 49.5 ±1.9 (32K), 54.2 ±1.4 (64K) | GLM-4.6 60.8; GLM-4.5-Air 50.5 / 57.4 |
| SWE-Lego (Jan 2026) | Qwen3-8B | not extracted | SFT, ~18k traj | 42.2; 49.6 with TTS@16 | — |
| SWE-Lego (Jan 2026) | Qwen3-32B | not extracted | SFT | 52.6; 58.8 with TTS@16 | — |
| SWE-Protégé (Feb 2026) | Qwen2.5-Coder-7B + expert calls | Claude Sonnet 3.7 (train); Opus 4.1 / Sonnet 4.5 / Sonnet 3.7 (eval expert) | SFT + RL | 42.4 / 41.0 / 30.6 by expert | prior SLM SOTA SWE-agent-LM-7B 17 |
| Scale-SWE (Feb 2026) | Qwen3-30B-A3B | DeepSeek-V3.2 | SFT, 71,498 traj | 64.0 (base 22.0) | teacher score not extracted |
| Open-SWE-Traces (Jun 2026) | Qwen3-Coder-30B-A3B | MiniMax-M2.5; Qwen3.5-122B-A10B | SFT, 207,489 traj | 61.7 no-think (base 51.6) | 80.2; 72.0 |
| Tmax (Jun 2026) | Qwen 3.5 9B | none (RL on terminal tasks) | RL | 55.3 (base 46.2), authors' harness | — |
| CANOPY (Sep 2026, abstract only) | Qwen3.5-9B | none | RL | +16.6 points | — |

- Sources for the table rows: [mini-coder](https://rdolmedo.github.io/blogs/minicoder.html); [DAgger revisit, 2605.12913](https://arxiv.org/html/2605.12913v1); [SERA, 2601.20789](https://arxiv.org/html/2601.20789v2); [SWE-Lego, 2601.01426](https://arxiv.org/abs/2601.01426); [SWE-Protégé, 2602.22124](https://arxiv.org/html/2602.22124v1); [Scale-SWE, 2602.09892](https://arxiv.org/html/2602.09892); [Open-SWE-Traces, 2606.16038](https://arxiv.org/html/2606.16038); [Tmax, 2606.23321](https://arxiv.org/html/2606.23321); [CANOPY, 2609.01245](https://arxiv.org/abs/2609.01245)
- DAgger revisit evaluates on 466 of the 500 Verified tasks (34 Matplotlib instances excluded) under OpenHands, so its numbers are not directly comparable with the others. — [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)
- mini-coder-4b at 26.8 is about 81% of its teacher's 33.2 with roughly 7.5× fewer total parameters (teacher is a 30B MoE with 3B active). The author also reports it matches gpt-oss-120b (26.0) in the same bash-only setup. — [mini-coder blog](https://rdolmedo.github.io/blogs/minicoder.html)
- SWE-Protégé's 42.4% uses about 4 expert calls per task (cap 6), with expert tokens about 11% of total tokens; median expert cost per task falls from $0.54 (Sonnet 3.7 alone) and $1.24 (Sonnet 4.5 alone) to $0.13 and $0.15. Without expert calls, on 400 newer held-out tasks the 7B model scores 32.0% and with Sonnet 3.7 it scores 40.3%. — [arXiv 2602.22124](https://arxiv.org/html/2602.22124v1)
- SWE-Protégé internal inconsistencies: the abstract reports +25.4 points over the prior SLM state of the art while the text cites +30.6; Table 1 lists the Sonnet 3.7 configuration at 30.8% and Table 2 at 30.6%. — [arXiv 2602.22124](https://arxiv.org/html/2602.22124v1)
- Scale-SWE's introduction says the resolve rate rises "from 22% to 60%", while the abstract, Section 3.2, tables and conclusion all say 64.0%. In a same-pipeline SFT comparison it reports Scale-SWE data 64.0 vs SWE-Gym data 54.8 vs SWE-smith data 54.6. No variance or seeds are reported. — [arXiv 2602.09892](https://arxiv.org/html/2602.09892)
- Open-SWE-Agent on harder sets: SWE-bench Multilingual 57.1 (base 33.5; Qwen3.5-122B teacher 68.3); SWE-bench Pro 36.8 (base 28.4; teacher 53.6). — [arXiv 2606.16038](https://arxiv.org/html/2606.16038)
- SERA repository specialization (8,000 trajectories per repo, ~$1,300): the specialized 32B student scores 52.23 ±1.64 on Django vs teacher GLM-4.5-Air 51.20 ±1.80, 51.11 ±1.54 on Sympy vs 48.89 ±3.08, but 37.14 ±6.95 on Sphinx vs 43.51 ±0.58. With general (non-repo) data the student does not match the teacher even at 16,000 samples. — [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- SERA cost: about 40 GPU-days (~$2,000) for data generation plus training of SERA-32B; the authors estimate it is 26× cheaper than SkyRL (RL) and 57× cheaper than SWE-smith with self-hosted inference. — [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)

**Terminal-Bench 2.0 (pass rate, %; teacher shown where the paper gives it)**

| Paper (date) | Student → result | Base | Teacher (teacher's own TB 2.0) | Data |
|---|---|---|---|---|
| Nemotron-Terminal (Feb 2026) | Qwen3-8B → 13.0 ±2.2 | 2.47 | DeepSeek-V3.2 (38.2 in that paper's Table 3) | ~490k samples, SFT |
| Nemotron-Terminal | Qwen3-14B → 20.2 ±2.7 | 4.04 | same | same |
| Nemotron-Terminal | Qwen3-32B → 27.4 ±2.4 | 3.37 | same | same |
| Terminal-Lego (Jun 2026) | Qwen3-8B → 11.8 | 2.5 | DeepSeek-V3.2 (39.3) | 15.3k traj, SFT |
| Terminal-Lego | Qwen3-32B → 24.3 | 3.4 | same | same |
| CLI-Universe (Jun 2026) | Qwen3-8B → 10.9 | 2.5 | Kimi-K2.6 (not given) | 6k traj, SFT |
| CLI-Universe | Qwen3-14B → 23.0 | 4.0 | same | same |
| CLI-Universe | Qwen3-32B → 33.4 | 3.4 | same | same |
| Meta-Task (Jul 2026, abstract only) | Qwen3-14B → 22.5; Qwen3-32B → 31.8 | — | not stated | 3,221 traj, SFT |
| LiteCoder-Terminal (May 2026, abstract only) | 32B → 18.54 | — | — | 11,255 traj SFT + RL |
| Tmax (Jun 2026) | Qwen3.5-2B → 9.4 | 1.5 | none (RL) | 13,565 envs |
| Tmax | Qwen3.5-4B → 25.1 | 16.5 | none | same |
| Tmax | Qwen3.5-9B → 33.0 | 21.0 | none | same |
| Tmax | Qwen3.6-27B → 44.9 | 42.7 | none | same |

- Sources: [Nemotron-Terminal, 2602.21193](https://arxiv.org/html/2602.21193v1); [Terminal-Lego, 2606.03461](https://arxiv.org/html/2606.03461); [CLI-Universe, 2606.22883](https://arxiv.org/html/2606.22883); [Meta-Task, 2607.27929](https://arxiv.org/abs/2607.27929); [LiteCoder-Terminal, 2605.29559](https://arxiv.org/abs/2605.29559); [Tmax Table 15, 2606.23321](https://arxiv.org/html/2606.23321)
- Reference points on Terminal-Bench 2.0 quoted in these papers: GPT-5.5 82.0 (Codex CLI), Claude Opus 4.6 62.9, GLM-5 52.4, DeepSeek-V3.2 39.6, GPT-5-mini 24.0 (31.9 in Tmax's table), Qwen3-Coder-480B 23.9, GPT-OSS-120B 18.7, GPT-OSS-20B 3.1. — [arXiv 2606.03461](https://arxiv.org/html/2606.03461); [arXiv 2606.23321](https://arxiv.org/html/2606.23321)
- The best distilled 32B student (CLI-Universe, 33.4) is still below the mid-tier open teacher DeepSeek-V3.2 (39.6) and about 20–50 points below frontier closed models on the same benchmark. — [arXiv 2606.22883](https://arxiv.org/html/2606.22883); [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- TermiGen on Terminal-Bench 1.0: TermiGen-Qwen2.5-Coder-32B 31.3 ±1.8 (untuned base 4.5 ±0.7); TermiGen-Qwen3-32B 27.5 ±1.3 (untuned 10.4 ±1.2); compare o4-mini with Codex CLI 20.0, Claude-3.7-Sonnet with Claude Code 35.2, GPT-5-Codex 42.8, Apex2 with Claude-4.5-Sonnet 64.5. The same model family is listed at 18.0–19.3 on Terminal-Bench 2.0 by later papers. — [arXiv 2602.07274](https://arxiv.org/html/2602.07274v1); [arXiv 2606.23321](https://arxiv.org/html/2606.23321)
- Tmax RL deltas on other splits: Qwen3.5-9B 49.4 → 65.6 on Terminal-Bench Lite and 20.5 → 29.6 on TB 2.1; Qwen3.6-27B 43.6 → 43.9 on TB 2.1 (within noise). An estimated single Tmax-9B RL run costs about $3,150 in sandbox fees. — [arXiv 2606.23321](https://arxiv.org/html/2606.23321)

**tau-bench family and tool-calling**

- SynthAgent on TAU-2 (Airline / Telecom / Retail): SynthAgent-8B 34.5 / 38.2 / 57.2 and SynthAgent-14B 40.0 / 44.7 / 58.6, versus untuned Qwen3-8B 15.0 / 8.8 / 32.5, Qwen3-32B 22.5 / 27.6 / 44.7, and the 235B task-generating teacher 47.5 / 37.7 / 68.0. Seven-benchmark agentic average: 8B 42.9, 14B 46.3, Qwen3-32B 36.0, Qwen3-235B 49.7. — [arXiv 2601.22511v2](https://arxiv.org/html/2601.22511v2)
- ToolOrchestra's 8B orchestrator (which calls GPT-5 and other tools) reports τ²-Bench 80.2 vs 77.7 for GPT-5 with basic tools, HLE 37.1 vs 35.1, FRAMES 76.3 vs 74.0, at cost 9.2 cents vs 30.2 cents per task (HLE/FRAMES average). The authors could reproduce GPT-5 at only 77.7 on τ²-Bench, not the 84.2 reported elsewhere. — [arXiv 2511.21689](https://arxiv.org/html/2511.21689v1)
- CANOPY (abstract only): a Qwen3-14B policy trained by outcome-only RL reports AppWorld Test-Normal TGC 86.9 and Test-Challenge 67.6, described as top of the public leaderboard as of a Feb 2026 snapshot. — [arXiv 2609.01245](https://arxiv.org/abs/2609.01245)

**Deep search: BrowseComp, GAIA, others**

- WebExplorer-8B (SFT → SFT+RL): BrowseComp-en 7.9 → 15.7; BrowseComp-zh 21.3 → 32.0; GAIA text-only (103 samples) 43.7 → 50.0; WebWalkerQA 59.8 → 62.7; FRAMES 72.6 → 75.7; XBench-DeepSearch 47.5 → 53.7; HLE 16.0 → 17.3. — [arXiv 2509.06501v3](https://arxiv.org/html/2509.06501v3)
- WebExplorer-8B vs larger systems in the same table: beats WebSailor-72B on BrowseComp-en (15.7 vs 12.0) and -zh (32.0 vs 30.1) but trails it on GAIA (50.0 vs 55.4); trails DeepSeek-V3.1 (30.0 / 49.2 / 63.1) and OpenAI o3 (50.9 / 58.1 / 70.5) by wide margins. — [arXiv 2509.06501v3](https://arxiv.org/html/2509.06501v3)
- SCoRe deep-search average (GAIA, HLE, xBench, WebWalker) with a Qwen3-8B student: SCoRe-RL 30.5 (GAIA 40.8, HLE 11.0, xBench 27.0, WebWalker 43.0) vs Qwen2.5-72B teacher 27.3, DeepSeek-V3 32.4, behaviour cloning 22.8, BC+GRPO 22.2. — [arXiv 2509.14257v3](https://arxiv.org/html/2509.14257v3)

**Short-horizon QA / math / embodied text (where students do match teachers)**

- Agent Distillation, average over 8 QA+math tasks (teacher Qwen2.5-32B: 46.00 as agent, 39.54 with CoT): 7B 42.68, 3B 36.60, 1.5B 30.55, 0.5B 21.90 with ftp+sag; plain agent distillation gives 39.85 / 33.60 / 28.06 / 19.24; CoT distillation gives 33.54 / 27.72 / 21.28 / 13.64. Untuned small models collapse as agents (1.5B 7.94, 0.5B 1.80). — [arXiv 2505.17612v2](https://arxiv.org/html/2505.17612v2)
- SCoRe, average over 8 math+multi-hop tasks with a 7B student and 72B teacher: teacher 51.1; BC 43.0; BC+GRPO 48.2; SCoRe-SFT 46.1; SCoRe-RL 52.3. — [arXiv 2509.14257v3](https://arxiv.org/html/2509.14257v3)
- SOD (teacher: GRPO-tuned Qwen3-4B, average 61.59 on AIME24/25, GPQA-Diamond, LiveCodeBench v6): 1.7B student SOD 42.98 vs OPD 36.27, SFT 25.91, GRPO 25.39, untuned 17.10; 0.6B student SOD 24.22 vs OPD 20.04, SFT 8.97, GRPO 11.32, untuned 12.16. The 1.7B student reaches about 70% of the teacher. — [arXiv 2605.07725](https://arxiv.org/html/2605.07725v1)
- UOPD (teacher: RL-trained 7B; ALFWorld seen/unseen 97.4 / 92.8, WebShop score 85.4): 3B student 90.0 / 88.8 / 82.4 vs OPD 88.1 / 85.3 / 77.5; 1.5B student 89.8 / 86.6 / 76.8 vs OPD 86.2 / 84.8 / 66.3. — [arXiv 2609.34036](https://arxiv.org/html/2609.34036v1)
- SDAR (abstract only): gains over GRPO of +9.4% on ALFWorld, +7.0% on Search-QA, +10.2% on WebShop accuracy. — [arXiv 2605.15155](https://arxiv.org/abs/2605.15155)

**Web / computer-use**

- Fara-7B (SFT only): WebVoyager 73.5, Online-Mind2Web 34.1, DeepShop 26.2, WebTailBench 38.4. Its data-generating teacher stack scores far higher as a set-of-marks agent (GPT-5: 90.6 / 57.7 / 49.1 / 60.4; o3: 79.3 / 55.4 / 49.7 / 52.7). It beats UI-TARS-1.5-7B (66.4 / 31.3 / 11.6 / 19.5). Cost per WebVoyager task $0.025 vs $0.316 for GPT-5 SoM. — [arXiv 2511.19663](https://arxiv.org/html/2511.19663)
- Fara-7B caveats: the WebVoyager set was modified by the authors; LLM-verifier agreement with humans is 83.3%; human evaluation gave 62% on the filtered WebVoyager tasks, lower than the auto-judge score. — [arXiv 2511.19663](https://arxiv.org/html/2511.19663)
- Plan-and-Act with an 8B model: LLaMA-3.1-8B + CoT reaches 53.33 on WebArena-Lite and 58.08 on WebVoyager, versus 57.58 (70B) on WebArena-Lite and 81.36 (QwQ-32B) on WebVoyager. — [arXiv 2503.09572v3](https://arxiv.org/html/2503.09572v3)

### Inferences
- On long-horizon coding/terminal benchmarks, the student-to-teacher ratio after SFT distillation is roughly 60–80% at ~30B (61.7 / 80.2 = 77% for Open-SWE-Traces; 24.3 / 39.3 = 62% for Terminal-Lego 32B; 27.4 / 38.2 = 72% for Nemotron-32B), and about 30–50% at 8B (11.8 / 39.3 = 30%; 13.0 / 38.2 = 34%; SERA-8B 31.7 / 60.8 = 52%). These ratios are my arithmetic on the papers' numbers.
- Claims of a small model "beating" a much larger one are almost always against an untuned general model of the previous generation (Qwen3-32B, GPT-OSS-120B, Qwen3-Coder-480B, WebSailor-72B), not against the teacher that produced the data.
- The strongest "small" results on SWE-bench Verified come either from ~30B MoE students with 131K context (Scale-SWE 64.0, Open-SWE 61.7) or from a 7B model that still spends ~11% of tokens on a frontier expert (SWE-Protégé). Fully standalone ≤8B students sit at roughly 27–42%.
- The base-model generation matters at least as much as the recipe: untuned Qwen3.5-9B scores 21.0 on Terminal-Bench 2.0 in Tmax's harness, above every distilled Qwen3-8B student in this survey (10.9–13.0).

### Gaps
- OSWorld: no primary-source numbers verified for small distilled models.
- METR time horizon: no paper in this survey reports a METR-style time horizon for a distilled small model.
- Original tau-bench (v1): no small-model distillation result found; only TAU-2 / τ²-Bench results. A Toloka vendor blog claims a 4B model went from ~6% to 71% on enterprise tool-use tasks via RL; I did not read or verify it. — [Toloka blog](https://toloka.ai/blog/teaching-a-4b-agent-enterprise-tool-use-from-6-to-71-task-success-in-under-a-day/)
- Teacher scores under the student's exact scaffold are missing for SWE-Lego, Scale-SWE, the DAgger paper, CLI-Universe (Kimi-K2.6) and TermiGen (Claude-4.5-Sonnet under BashAgent), so the "gap closed" cannot be computed for them.
- SWE-Lego's teacher model(s) and ablation numbers were not extracted (abstract page only).
- A search snippet said the LiteCoder-Terminal paper reports difficulty reproducing Nemotron-Terminal-32B's 27.4%; I could not confirm this on the abstract page. — [arXiv 2605.29559](https://arxiv.org/abs/2605.29559)

---

## Q3. What does NOT work, and what are the fundamental limits?

### Takeaway
Three failure classes are documented with numbers: (1) pure imitation of teacher traces leaves students that loop, fail to recover, and drift off-distribution; (2) naive on-policy fixes fail because the teacher's supervision degrades on the student's corrupted states; (3) context length, not reasoning, is the dominant residual failure on long tasks. Several intuitive levers also fail outright: stronger teachers, longer-context training, curricula, and SFT on top of an already-strong base.

### Cited Findings

**Compounding error and off-policy mismatch**
- Theory used across the area: with per-step error ε under the teacher's state distribution, off-policy imitation has discrepancy O(εT²) over a length-T trajectory; training on the student's own state distribution reduces it to O(εT). The OPD survey adds that this fails to hold when the teacher's distribution on badly out-of-distribution student prefixes is poorly calibrated. — [OPD survey, arXiv 2604.00626](https://arxiv.org/html/2604.00626v1)
- SCoRe states the same bound for agents (behaviour cloning O(H²ε) vs O(Hε)) and says explicitly that its method "reduces but does not eliminate" compounding error and that the bound is conditional on its assumptions. — [arXiv 2509.14257v3](https://arxiv.org/html/2509.14257v3)
- Measured covariate shift: under SFT on teacher trajectories, reverse KL on student-visited states falls from about 0.27 to 0.10 and then rebounds to about 0.126 as more off-policy data is added; DAgger variants stay near 0.10. SFT performance on a 100-task SWE-bench Verified subset peaks at 20% and then drops to 19% with more data, while DAgger reaches 26%. — [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)
- Even in a task with the plan and knowledge supplied, per-step accuracy falls as the task proceeds, and models become more error-prone when their own earlier errors are in context ("self-conditioning"); the authors report that scaling model size does not remove it, though thinking models did not self-condition in their setup. They estimate about 20% of GAIA, 48% of ALFWorld and 33% of WebShop failures resemble self-conditioning (a subjective classification). — [Illusion of Diminishing Returns, arXiv 2509.09677v3](https://arxiv.org/html/2509.09677v3) (ICLR 2026 per [ICLR listing](https://iclr.cc/virtual/2026/poster/10011614))

**Imitation without recovery: looping and stalling**
- After SFT on expert-augmented trajectories, 31.0% of the 7B student's trajectories contain a repeated-action run longer than 10 steps; RL with a loop penalty cuts this to 0.8% and steps per task from about 60 to about 20. Loop suppression alone gave little accuracy gain; gains appeared only after adding the follow-through reward. — [SWE-Protégé, arXiv 2602.22124](https://arxiv.org/html/2602.22124v1)
- The 30B Open-SWE-Agent still loops and exhausts its turn limit in roughly 5–10% of cases under OpenHands. — [arXiv 2606.16038](https://arxiv.org/html/2606.16038)
- TermiGen's authors argue standard rejection-sampled distillation shows only clean successes; adding injected-error recovery trajectories gives 25.0% vs 21.8% for standard trajectories at equal data size (N = 800) on Terminal-Bench 1.0. — [arXiv 2602.07274](https://arxiv.org/html/2602.07274v1)
- Small agents "often over-rely on the first retrieved document instead of retrieving again", and agent distillation "does not directly improve core reasoning ability". — [Agent Distillation, arXiv 2505.17612v2](https://arxiv.org/html/2505.17612v2)

**Naive on-policy distillation fails in multi-turn, tool-using settings**
- A single erroneous tool call injects a corrupted observation; student–teacher divergence then accelerates and teacher entropy becomes unstable in later steps, so uniform-weight OPD over-weights corrupted signals. The 1.7B OPD run peaks early and then degrades. Naive OPD without GRPO scores 33.79 vs 40.78 for step-weighted OPD without GRPO. — [SOD, arXiv 2605.07725](https://arxiv.org/html/2605.07725v1)
- Standard OPD lowers the probability of a bad sampled action but does not supply a better one, and the bad action still executes, so mistakes repeat. In a 93-task ALFWorld probe, one teacher correction at a low-confidence step raised success from 13.98% to 25.81% (a random step: 16.13%). — [UOPD, arXiv 2609.34036](https://arxiv.org/html/2609.34036v1)
- "Supervision Fidelity Decay": as student prefixes get longer, the teacher's next-token distribution becomes less confident and less discriminative, so the reverse-KL correction weakens and drift compounds; the proposed fix gains +2.57 mean@8 over OPD for a 7B student and +4.92 on AIME-26 at 39k tokens (abstract only). — [arXiv 2605.30833](https://arxiv.org/abs/2605.30833)
- Applying on-policy self-distillation directly to multi-turn agents is "unstable" and naive GRPO+OPSD underperforms, per the SDAR abstract. — [arXiv 2605.15155](https://arxiv.org/abs/2605.15155)
- Capacity gap: the OPD survey reports that when the teacher-to-student capacity ratio exceeds about 10×, students tend to average over the teacher's distinct modes. — [arXiv 2604.00626](https://arxiv.org/html/2604.00626v1)
- White-box OPD needs teacher logits, which rules out closed frontier teachers; the DAgger paper positions black-box compatibility as its advantage. — [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)

**Outcome-only RL from scratch on small models**
- GRPO alone on SWE-Gym barely moves small models: 4B 11.2 → 11.6 and 8B 7.7 → 8.2 on SWE-bench Verified, versus 22.9 / 23.4 for SFT. — [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)
- At 0.6B, both SFT (8.97) and GRPO (11.32) end below the untuned model (12.16). — [SOD, arXiv 2605.07725](https://arxiv.org/html/2605.07725v1)
- Contradicting evidence: CANOPY's abstract argues the "ceiling" of outcome-only RL on small open models is caused by signal starvation and policy drift in common practice, not by a fundamental limit, and Tmax gets its gains with outcome-only RL and no SFT on Qwen 3.5. Both use newer, stronger base models and much larger exploration budgets (Tmax: group size 32, about 40% of groups all-zero). — [arXiv 2609.01245](https://arxiv.org/abs/2609.01245); [arXiv 2606.23321](https://arxiv.org/html/2606.23321)

**Context-length limits**
- After DAgger training, no-submission failures on SWE tasks are dominated by context overflow (57.5%); the authors conclude remaining errors are "dominated by long-context limits" and that memory or context management is needed. — [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)
- About 23–25% of SWE trajectories exceed 32K tokens (23.26% of SWE-smith, 24.83% of SERA's set); the same SERA-32B model scores 49.5% at 32K context and 54.2% at 64K. — [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Training with longer context did not help an 8B terminal student: SFT at 32,768 tokens gave 13.0, SFT at 65,536 gave 10.3, and YaRN variants gave 11.9. — [Nemotron-Terminal, arXiv 2602.21193](https://arxiv.org/html/2602.21193v1)
- WebExplorer needed a 128K context and up to 100 tool calls for an 8B model; average trajectories grew past 40K tokens during RL. — [arXiv 2509.06501v3](https://arxiv.org/html/2509.06501v3)

**Intuitive levers that failed**
- Stronger teacher ≠ better student: with 8.1K passed trajectories each, Claude Opus 4.6 (69.4 on TB 2.0) yields the weakest students (8B 5.6%, 32B 15.5%) and DeepSeek-V3.2 (39.3) the strongest (10.5%, 20.6%). Claude's trajectories average 3.8 turns vs 7.3 for DeepSeek. — [Terminal-Lego, arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- SERA likewise reports GLM-4.5-Air is "a much better teacher" than Claude 3.7 Sonnet despite similar SWE-bench scores. — [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Longer or more error-heavy successful rollouts did not help: the longest DeepSeek successes (12.2 turns) gave 12.7% vs 13.9% for the shortest (8.9 turns) on a 32B student. — [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- Curriculum hurt: a two-stage curriculum gave 10.39 vs 13.03 for mixed single-stage training (8B, TB 2.0). — [arXiv 2602.21193](https://arxiv.org/html/2602.21193v1)
- SFT on teacher trajectories degraded a strong recent base: Qwen 3.5 9B fell from 41.9 to 35.5 (Tmax SFT) and 31.3 (large SFT set) on Terminal-Bench Lite, while the same data raised the older Qwen3-8B from 7.3 to 11.5 and 16.4. The paper says existing SFT datasets degrade Qwen 3.5 by up to 10 points. — [Tmax Table 16, arXiv 2606.23321](https://arxiv.org/html/2606.23321)
- Simulated (LLM-generated) observations instead of real execution: 22.5% vs 25.0%, with observation errors in 26% of simulated trajectories. — [TermiGen, arXiv 2602.07274](https://arxiv.org/html/2602.07274v1)
- Removing the teacher's reasoning traces from training data dropped a SWE student from 41.00% to 23.00%. — [SERA, arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Masking the teacher's observation-inspection turns dropped terminal students from 10.5% / 20.6% (8B / 32B) to 3.8% / 13.8%. — [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- Fixed-interval (19.6%) and random (24.2%) escalation to an expert underperform learned autonomous escalation (30.6–42.4% depending on the expert; the ablation's expert configuration was not extracted); in-place rewriting of trajectories gives 14.2%, below the 17% baseline. — [SWE-Protégé, arXiv 2602.22124](https://arxiv.org/html/2602.22124v1)
- First-thought prefix can backfire: it reduced retrieval calls and pushed small students to state facts from memory, hurting HotpotQA and MuSiQue. — [arXiv 2505.17612v2](https://arxiv.org/html/2505.17612v2)
- Distilled thinking-mode students underperformed no-think students on SWE-bench Multilingual (47.6 vs 57.1 in the unresolved-included setting). — [arXiv 2606.16038](https://arxiv.org/html/2606.16038)

**Scaffold lock-in and evaluation fragility**
- Distilled students are tied to the training harness: Open-SWE students lose 2–3 points when the harness is swapped (56.0 → 53.9 and 56.8 → 53.9 on Verified); SERA is "sensitive to exact tool-format matching" and calls a nonexistent submit tool inside Claude Code, so the authors ship a proxy. — [arXiv 2606.16038](https://arxiv.org/html/2606.16038); [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Many published gains fall inside run-to-run noise (median std 1.2% on SWE-bench Verified); SERA recommends at least 3 seeds. — [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Synthetic tasks are often broken: in Tmax's pipeline an LLM judge flagged 76.4% of generated tasks as "verifier too weak" and 10.9% as "answer leak"; training on unrepaired tasks gave 59.8 / 27.3 vs 65.6 / 29.6 after repair. CLI-Universe discards about two-thirds of candidates; Terminal-Lego's Docker validation passes 41.8%. — [arXiv 2606.23321](https://arxiv.org/html/2606.23321); [arXiv 2606.22883](https://arxiv.org/html/2606.22883); [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- Teacher trajectories can contain cheating: Open-SWE-Traces needed an AST scanner to remove "git hacking" trajectories; Scale-SWE strips future commit history. — [arXiv 2606.16038](https://arxiv.org/html/2606.16038); [arXiv 2602.09892](https://arxiv.org/html/2602.09892)

### Inferences
- The 2026 evidence suggests the binding limit after distillation shifts from "cannot act" to "cannot sustain": submission rates approach 98%, looping can be trained away, and what remains is context overflow and weak recovery. That points at context/memory management as the next lever, yet no paper in this survey trains a small student with a memory or compaction tool and measures the gain.
- The "weaker teacher teaches better" result and the "reasoning traces are essential" result point the same way: students learn from visible, grounded process (inspect → act → check), and a very strong teacher that solves a task in 3.8 turns shows too little of it.
- The disagreement on outcome-only RL is plausibly a base-model effect: GRPO fails on Qwen3-4B/8B (near-zero success, no gradient) and works on Qwen3.5-9B (21% base success). This is my reading; no paper tests it directly.
- OPD's theoretical O(εT) guarantee is exactly the part that breaks in tool-using agents, because the teacher is unreliable on the states the student reaches.

### Gaps
- No paper found that measures student-vs-teacher gap as a function of trajectory length within one benchmark (for example, resolve rate bucketed by teacher step count).
- No controlled comparison between SCoRe-style first-error correction and DAgger on the same benchmark; SCoRe argues against DAgger only qualitatively.
- No study of context-management or memory-tool training for small distilled agents; TermiGen and the DAgger paper both list it as future work.
- The self-conditioning classification on GAIA/ALFWorld/WebShop is described by its authors as subjective.

---

## Q4. Which ingredients are consistently effective?

### Takeaway
Robustly supported: an SFT warm start for weak bases, followed by RL or on-policy correction; training on the student's own state distribution with teacher intervention concentrated at error points; real executable environments; keeping teacher reasoning and observation-checking turns; error-recovery demonstrations; and in-domain or repo-specific data. Success-only filtering is NOT consistently supported — four papers find keeping failed trajectories helps and one finds the opposite.

### Cited Findings

**RL after SFT (consistent gain where the base is weak)**
- WebExplorer-8B: RL after SFT roughly doubles BrowseComp-en (7.9 → 15.7) and adds 6.3 points on GAIA (43.7 → 50.0). — [arXiv 2509.06501v3](https://arxiv.org/html/2509.06501v3)
- SCoRe: SFT 46.1 → RL 52.3 on the reasoning average; on held-out "hard-to-teach" cases RL lifts 17.3% → 24.3% (math) and 20.4% → 26.3% (search). — [arXiv 2509.14257v3](https://arxiv.org/html/2509.14257v3)
- SWE-Protégé: RL adds +2.8, +6.2 and +1.2 points over SFT across three experts (mean +3.4) with only 100 tasks and 160 steps. — [arXiv 2602.22124](https://arxiv.org/html/2602.22124v1)
- Tmax on Qwen3-8B: base 5.0 → SFT 9.1 → RL 17.8 on Terminal-Bench Lite. — [arXiv 2606.23321](https://arxiv.org/html/2606.23321)
- SOD: removing GRPO costs 2.2 points (40.78 vs 42.98); removing step-wise OPD costs 17.6 (25.39). — [arXiv 2605.07725](https://arxiv.org/html/2605.07725v1)
- mini-coder: distillation raises pass@100 from 25.1 to 60.2 at 4B, which the author proposes as the precondition for RL (more tasks yield reward signal); no RL experiment is reported. — [mini-coder blog](https://rdolmedo.github.io/blogs/minicoder.html)

**On-policy data with targeted teacher correction**
- DAgger-style mixing beats SFT by +4.4 (4B) and +6.4 (8B) and beats pure OPD by +3.9 and +3.6 on SWE-bench Verified; submission rate rises from 52.1% (base) to 97.9%. It is also more sample-efficient at cold start (20% vs 13% for OPD at ~3K samples on a 100-task subset). — [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)
- SCoRe-SFT (student rollouts with first-error correction) beats behaviour cloning at equal data: 46.1 vs 43.0. — [arXiv 2509.14257v3](https://arxiv.org/html/2509.14257v3)
- Where the teacher intervenes matters: random intervention at the same rate gives WebShop score 77.3 vs 82.4 for uncertainty-targeted intervention; removing the SFT-on-teacher-action term drops ALFWorld unseen to 80.8 from 88.8; a heavy 50% → 30% intervention schedule is worse (69.9) than 30% → 5%. — [UOPD, arXiv 2609.34036](https://arxiv.org/html/2609.34036v1)
- Short-horizon RL from a verified prefix and key-step rewards each matter: 48.4 without short-horizon rollouts, 49.7 without key-step rewards, 52.3 with both. — [arXiv 2509.14257v3](https://arxiv.org/html/2509.14257v3)

**Filtering by success — conflicting evidence**
- Keeping failures helps: Nemotron-Terminal synthetic tasks, no filter 12.4 (264,207 samples) vs complete-only 6.74 (104,603) vs success-only 5.06 (83,448) on TB 2.0 with an 8B student. — [arXiv 2602.21193](https://arxiv.org/html/2602.21193v1)
- Keeping failures helps: TermiGen, all trajectories 31.3% (3,291) vs only fully-passing 25.0% (2,040). — [arXiv 2602.07274](https://arxiv.org/html/2602.07274v1)
- Keeping failures helps: Open-SWE-Traces, unresolved-included beats resolved-only (Multilingual no-think 57.1 vs 49.6; Verified think 58.1 vs 55.3). — [arXiv 2606.16038](https://arxiv.org/html/2606.16038)
- Failed trajectories carry signal: 2.5K failed DeepSeek traces alone give a 32B student 16.1%, above 8.1K passed Claude traces (15.4%); for the 8B student they give only 3.5%. — [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- Verification barely matters: SERA finds unverified second-rollout data no worse than hard-verified data at 7,400 samples (p = .066 across thresholds). — [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Contradiction: CLI-Universe finds success-only (6k) 33.4 vs the complete set including failures (10k) 28.2 on a 32B student. — [arXiv 2606.22883](https://arxiv.org/html/2606.22883)
- Scale-SWE, WebExplorer, SWE-Protégé and Fara-7B all use success-only / verified trajectories without ablating the choice. — [arXiv 2602.09892](https://arxiv.org/html/2602.09892); [arXiv 2509.06501v3](https://arxiv.org/html/2509.06501v3); [arXiv 2602.22124](https://arxiv.org/html/2602.22124v1); [arXiv 2511.19663](https://arxiv.org/html/2511.19663)

**Error-recovery and environment-grounded trajectories**
- Injected-error recovery trajectories: +3.2 points at equal size (25.0 vs 21.8). — [arXiv 2602.07274](https://arxiv.org/html/2602.07274v1)
- Prompting a terse teacher to inspect the environment more (raising Claude's observation ratio from 2.5% to 6.6%) lifts its 32B student from 15.4% to 19.5% and the teacher's own pass rate from 88.7% to 95.4%. High-observation subsets beat low-observation subsets (14.6% vs 11.8%). — [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- SWE-Lego reports gains from masking erroneous actions in the loss ("error masking") while keeping them in context; exact ablation numbers not extracted. — [arXiv 2601.01426](https://arxiv.org/abs/2601.01426)
- Counter-note: in Terminal-Lego, error-recovery density itself did not explain teacher differences, and SOD's "mask-after-error" ablation (31.85) is worse than uniform weighting (34.70). — [arXiv 2606.03461](https://arxiv.org/html/2606.03461); [arXiv 2605.07725](https://arxiv.org/html/2605.07725v1)

**Teacher-generated tasks, environments and curricula**
- Synthetic skill-composed tasks beat adapted existing datasets for terminal skills (12.4 vs 9.66 at 8B), and performance rises monotonically with synthetic data share, with the 14B student gaining more than the 8B. — [arXiv 2602.21193](https://arxiv.org/html/2602.21193v1)
- Task design matters more than simulator size: removing the user/agent "information gap" drops TAU-2 Airline / Telecom / Retail from 34.5 / 38.2 / 57.2 to 22.0 / 28.9 / 35.3; a 235B tool simulator gave no gain over a 30B one. — [SynthAgent, arXiv 2601.22511v2](https://arxiv.org/html/2601.22511v2)
- Hardening tasks (WebExplorer's query evolution) lowers a strong model's accuracy from 86.6% to 67.1% and raises turns from 7.9 to 9.9, which the authors use to produce longer-horizon training data. — [arXiv 2509.06501v3](https://arxiv.org/html/2509.06501v3)
- A 9B model can generate its own environments: Tmax with 3.1k self-generated tasks gets 62.0 / 27.3 (TB Lite / TB 2.1), ahead of more than half the external datasets tested. — [arXiv 2606.23321](https://arxiv.org/html/2606.23321)
- Data quality beats volume in several comparisons: Terminal-Lego 15k trajectories 24.3% vs equal-size Nemotron-Terminal samples 17.2–19.9%; CLI-Universe 6k → 33.4 vs Nemotron 490k → 27.4; Meta-Task 3,221 → 31.8 (cross-paper, different pipelines). — [arXiv 2606.03461](https://arxiv.org/html/2606.03461); [arXiv 2606.22883](https://arxiv.org/html/2606.22883); [arXiv 2607.27929](https://arxiv.org/abs/2607.27929)
- Difficulty curricula: SWE-Lego reports a benefit; Nemotron-Terminal reports a loss (10.39 vs 13.03). — [arXiv 2601.01426](https://arxiv.org/abs/2601.01426); [arXiv 2602.21193](https://arxiv.org/html/2602.21193v1)

**In-domain specialization**
- With 100% in-repo data a 32B student matches its teacher at about 8,000 samples; mixed two-repo training averaged 48.15% vs 47.25% for 10k general samples. — [SERA, arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Multilingual data lifts non-Python performance sharply (43.1 → 57.1 on SWE-bench Multilingual) and Python slightly (54.9 → 58.1). — [arXiv 2606.16038](https://arxiv.org/html/2606.16038)

**Scaffolding, test-time tricks and hybrids**
- Self-consistent action sampling at test time: +2.0 at 1.5B and 7B, about +0.8 at 0.5B, −0.1 at 3B (mixed). — [arXiv 2505.17612v2](https://arxiv.org/html/2505.17612v2)
- A trained verifier with 16 candidates adds +7.4 (8B) and +6.2 (32B) on SWE-bench Verified. — [SWE-Lego, arXiv 2601.01426](https://arxiv.org/abs/2601.01426)
- Learned selective escalation: about 4 expert calls lift a 7B model from 32.0% (no expert, held-out set) to 40.3%; the expert must see full history (33.4% vs 29.0%). — [arXiv 2602.22124](https://arxiv.org/html/2602.22124v1)
- Dynamic replanning by a separate planner: +10.31 points on WebArena-Lite (53.94 vs 43.63); but a planner without matching synthetic data can hurt a fine-tuned executor (36.36 with no planner vs 17.16 with a base planner). — [Plan-and-Act, arXiv 2503.09572v3](https://arxiv.org/html/2503.09572v3)
- Ordered truncation of over-long training trajectories beats random truncation (43.00% vs 37.47%). — [SERA, arXiv 2601.20789](https://arxiv.org/html/2601.20789v2)
- Harness choice for small models: Tmax found Terminus-2 "more brittle with small models" and used mini-SWE-agent with a persistent shell. — [arXiv 2606.23321](https://arxiv.org/html/2606.23321)

### Inferences
- A defensible 2026 recipe from this evidence: build real executable tasks → collect trajectories from a mid-strength, process-verbose teacher with reasoning kept → SFT (only if the base is weak) without strict success filtering → on-policy phase (DAgger-style mixing or RL) to fix looping and recovery → optional verifier or expert escalation at test time. No single paper tests the whole chain.
- The filtering contradiction is probably about data volume and failure quality, not a universal rule: in the three "keep failures" terminal/SWE results the unfiltered set is 1.6–3× larger, whereas CLI-Universe's failures came from an already heavily verified task pool. None of the papers controls for size.
- "Memory tools" and "scaffolding" as a trained ingredient are essentially untested for small students in this literature; the evidence covers harness choice, context size and truncation only.

### Gaps
- No paper isolates success filtering at fixed dataset size on a long-horizon benchmark.
- SWE-Lego's error-masking and curriculum ablation numbers were not extracted.
- No evidence found on memory/compaction tools as a distillation ingredient.
- MENTOR's quantitative results were not available on the abstract page.

---

## Q5. How does task-horizon length scale with model size after distillation?

### Takeaway
No paper measures a METR-style time horizon for distilled small models or fits a horizon-vs-size law. The available proxy — success rate on long-horizon benchmarks after identical distillation — shows a steep, roughly log-linear size dependence that does not flatten: on Terminal-Bench 2.0 the same data yields about 11–13% at 8B, 20–23% at 14B and 24–33% at 32B, and larger students also extract more from the same data.

### Cited Findings
- Same data, three sizes (Nemotron-Terminal, TB 2.0): 8B 13.0, 14B 20.2, 32B 27.4 from near-identical bases (2.5–4.0). The 14B student gains more than the 8B as synthetic data is scaled up. — [arXiv 2602.21193](https://arxiv.org/html/2602.21193v1)
- Same data, three sizes (CLI-Universe, TB 2.0): 8B 10.9, 14B 23.0, 32B 33.4. — [arXiv 2606.22883](https://arxiv.org/html/2606.22883)
- Same data, two sizes (Terminal-Lego, TB 2.0): 8B 11.8, 32B 24.3; the 8B student needed 7 epochs vs 3 for the 32B. Failed trajectories helped the 32B student (16.1%) but not the 8B (3.5%). — [arXiv 2606.03461](https://arxiv.org/html/2606.03461)
- Same RL recipe, four sizes (Tmax, TB 2.0, newer Qwen3.5/3.6 bases): 2B 9.4, 4B 25.1, 9B 33.0, 27B 44.9 (bases 1.5, 16.5, 21.0, 42.7). By my subtraction the RL gains are +7.9, +8.6, +12.0 and +2.2 points, so the gain peaks at 9B and nearly vanishes at 27B. — [arXiv 2606.23321](https://arxiv.org/html/2606.23321)
- SWE-bench Verified, same recipe across sizes: mini-coder 1.7B 18.6 vs 4B 26.8 (teacher 33.2); SERA 8B 31.7 vs 32B 49.5; SWE-Lego 8B 42.2 vs 32B 52.6; DAgger 4B 27.3 vs 8B 29.8. — [mini-coder blog](https://rdolmedo.github.io/blogs/minicoder.html); [arXiv 2601.20789](https://arxiv.org/html/2601.20789v2); [arXiv 2601.01426](https://arxiv.org/abs/2601.01426); [arXiv 2605.12913](https://arxiv.org/html/2605.12913v1)
- Short-horizon tasks, same recipe (Agent Distillation average): 0.5B 21.90, 1.5B 30.55, 3B 36.60, 7B 42.68, 32B teacher 46.00 — each agent-distilled student roughly matches the next size up trained with CoT distillation. — [arXiv 2505.17612v2](https://arxiv.org/html/2505.17612v2)
- Controlled execution-only task (no distillation): larger Qwen3 (4/8/14/32B) and Gemma3 (4/12/27B) models execute markedly more turns correctly even when small models have 100% single-turn accuracy; gains with size "do not seem diminishing"; Qwen3-32B still falls below 50% task accuracy within 15 turns. The authors decline to fit a scaling law. — [arXiv 2509.09677v3](https://arxiv.org/html/2509.09677v3)
- The same paper gives the idealized relation: with constant per-step accuracy p and no self-correction, the horizon at success threshold s is H_s = ln(s) / ln(p), so the 50% horizon is −ln 2 / ln p; small gains in step accuracy near 1 produce large gains in horizon. — [arXiv 2509.09677v3](https://arxiv.org/html/2509.09677v3)
- Longer step budgets help small and large agents alike: Fara-7B and UI-TARS-1.5-7B both improve as the budget grows from 15 to 100 steps; Fara-7B averages 16.5 actions per WebVoyager task vs 41.3 for UI-TARS-1.5-7B. — [arXiv 2511.19663](https://arxiv.org/html/2511.19663)
- METR's own time-horizon work covers frontier and large open models only: its Time Horizon 1.1 (Jan 2026) reports a post-2023 doubling time of 131 days, and a preliminary DeepSeek/Qwen evaluation covered Qwen2-72B, Qwen2.5-72B and DeepSeek V3/R1 models, concluding mid-2025 DeepSeek models are similar to late-2024 frontier models. These figures come from search-result summaries of METR pages, not pages I read in full. — [METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1); [METR DeepSeek/Qwen report](https://metr.org/evaluations/deepseek-qwen-report/)

### Inferences
- Applying the idealized formula as a rough illustration (my arithmetic, not from any paper): a 50% horizon of 10 steps needs p ≈ 0.933, 50 steps needs p ≈ 0.986, and 200 steps needs p ≈ 0.9965. Distillation that lifts a small student's per-step accuracy from 0.93 to 0.986 buys a 5× horizon, but each further doubling needs roughly a halving of the remaining per-step error — which is where capacity limits and self-conditioning bite.
- Across the three Terminal-Bench SFT papers, each doubling of student size from 8B to 32B adds roughly 7–11 points; the 8B/32B ratio is 0.33–0.49. On SWE-bench Verified the 8B/32B ratio is higher (0.64–0.80), consistent with terminal tasks being longer and less templated. These ratios are my arithmetic on the cited numbers.
- Size appears to interact with data: larger students benefit more from added data (Nemotron) and from noisy/failed trajectories (Terminal-Lego). Small students seem to need cleaner, more on-policy supervision for the same horizon.
- A newer-generation 4B base after RL (Tmax-4B, 25.1) matches or beats older-generation distilled 32B students (24.3–27.4) on Terminal-Bench 2.0, so "horizon vs parameter count" is confounded by base-model generation and pre-training quality.

### Gaps
- No measurement of METR-style 50% time horizon (in human-minutes) for any distilled sub-10B model was found.
- No paper reports success rate bucketed by task length for students of several sizes, so the statement "the small-vs-large gap widens with horizon" is supported by theory (O(εT²)) and by the execution-only study, not by a distillation experiment.
- Exact per-size horizon numbers in the "Illusion of Diminishing Returns" paper are only in figures and were not extracted.
- No results below 2B on genuinely long-horizon benchmarks other than Tmax-2B (9.4 on TB 2.0) and mini-coder-1.7b (18.6 on SWE-bench Verified).
