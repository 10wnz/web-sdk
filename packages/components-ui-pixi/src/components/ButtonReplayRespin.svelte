<script lang="ts">
	import { Button, type ButtonProps } from 'components-pixi';
	import { Authenticate, OnHotkey } from 'components-shared';
	import { Container, Text } from 'pixi-svelte';
	import { stateBet } from 'state-shared';
	import { UI_BASE_FONT_SIZE, UI_BASE_SIZE } from '../constants';
	import { getContext } from '../context';
	import UiSprite from './UiSprite.svelte';
	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const sizes = { width: UI_BASE_SIZE, height: UI_BASE_SIZE };
	const context = getContext();
	const canPress = () => context.stateXstateDerived.isIdle();
	const disabled = $derived(!context.stateXstateDerived.isIdle());
	// ✅ Store replay function from Authenticate
	let replayPress: (() => Promise<void>) | null = null;

	// ✅ FINAL unified handler
	const handlePress = async () => {
		// ✅ HARD BLOCK — no input allowed mid-spin
		if (!canPress()) {
			return;
		}

		// ✅ 1) Run replay preparation if available
		if (replayPress) {
			await replayPress();
		}

		// ✅ 2) Sound
		context.eventEmitter.broadcast({ type: 'soundPressBet' });

		// ✅ 3) Restore replay mode if needed
		if (stateBet.betToResume?.active && stateBet.betToResume.mode) {
			stateBet.activeBetModeKey = stateBet.betToResume.mode;
		}

		// ✅ 4) Start spin
		context.eventEmitter.broadcast({ type: 'resumeBet' });
	};
</script>

<Authenticate>
	{#snippet children({ onpress })}
		{@const _ = replayPress = onpress}
		<OnHotkey hotkey="Space" {disabled} onpress={handlePress} />
		<Button {...props} {sizes} onpress={handlePress} {disabled}>
			{#snippet children({ center, hovered })}
				<Container {...center}>
					<UiSprite
						key="replay"
						width={sizes.width}
						height={sizes.height}
						anchor={0.5}
						{...disabled
							? {
									backgroundColor: 0xaaaaaa
								}
							: {}}
					/>
					<Text
						anchor={0.5}
						text="REPLAY"
						style={{
							align: 'center',
							wordWrap: true,
							wordWrapWidth: 200,
							fontFamily: 'proxima-nova',
							fontWeight: '600',
							fontSize: UI_BASE_FONT_SIZE * 0.9,
							fill: 0xffffff
						}}
					/>
				</Container>
			{/snippet}
		</Button>
	{/snippet}
</Authenticate>
