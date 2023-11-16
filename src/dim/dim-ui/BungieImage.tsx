'use client';

import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import React from 'react';

/**
 * A relative path to a Bungie.net image asset.
 */
export type BungieImagePath = string;

export type BungieImageProps = Omit<
	React.ImgHTMLAttributes<HTMLImageElement>,
	'onClick'
> & {
	src: BungieImagePath;
};

/**
 * An image tag that links its src to bungie.net. Other props pass through to the underlying image.
 */
export default React.memo(function BungieImage(props: ImageProps) {
	const { src, ...otherProps } = props;

	// Extract width and height from otherProps if they exist
	const { width, height, ...rest } = otherProps;

	// Convert width and height to the correct type or set a default value
	const widthProp =
		typeof width === 'string' ? parseInt(width, 10) : width || 0;
	const heightProp =
		typeof height === 'string' ? parseInt(height, 10) : height || 0;
	// Ensure placeholder is set to a valid value or not set at all
	const placeholder =
		otherProps.placeholder === 'blur' || otherProps.placeholder === 'empty'
			? otherProps.placeholder
			: undefined;

	return (
		<Image
			alt="src"
			src={src}
			draggable={false}
			loading="lazy"
			width={widthProp}
			height={heightProp}
			// {...rest}
			className={clsx(rest.className, 'no-pointer-events')}
			// placeholder='blur'
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
