'use client';

import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import React from 'react';

/**
 * A relative path to a Bungie.net image asset.
 */
export type BungieImagePath = string;

/**
 * An image tag that links its src to bungie.net. Other props pass through to the underlying image.
 */
export default React.memo(function BungieImage(props: ImageProps) {
	const { src, ...otherProps } = props;
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<Image
			// style={{ border: '1px solid green' }}
			alt="src"
			src={src}
			draggable={false}
			loading="lazy"
			className={clsx(otherProps.className, 'no-pointer-events')}
			width={otherProps.width}
			height={otherProps.height}
			placeholder="empty"
			{...otherProps}
		/>
	);
});

/**
 * Produce a style object that sets the background image to an image on bungie.net.
 */
export function bungieBackgroundStyle(src: BungieImagePath) {
	return {
		backgroundImage: `url("${bungieNetPath(src)}")`,
	};
}
/**
 * Produce a style object that sets the background image to an image on bungie.net.
 *
 * Has extra settings because sometimes life throws bad CSS choices your way
 */
export function bungieBackgroundStyleAdvanced(
	src: BungieImagePath,
	additionalBackground?: string,
	stacks = 1
) {
	const backgrounds = Array(stacks).fill(`url("${bungieNetPath(src)}")`);
	if (additionalBackground) {
		backgrounds.push(additionalBackground);
	}

	return {
		backgroundImage: backgrounds.join(', '),
	};
}

/**
 * Expand a relative bungie.net asset path to a full path.
 */
export function bungieNetPath(src: BungieImagePath): string {
	if (!src) {
		return '';
	}
	if (src.startsWith('~')) {
		return src.substr(1);
	}
	return `https://www.bungie.net${src}`;
}
