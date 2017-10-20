/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DraftPasteProcessor
 * @typechecks
 * @flow
 */

'use strict';

import type { DraftBlockRenderMap } from 'DraftBlockRenderMap';
import type { DraftBlockType } from 'DraftBlockType';
import type { EntityMap } from 'EntityMap';

const CharacterMetadata = require('CharacterMetadata');
const ContentBlock = require('ContentBlock');
const Immutable = require('immutable');

const convertFromHTMLtoContentBlocks = require('convertFromHTMLToContentBlocks');
const generateRandomKey = require('generateRandomKey');
const getSafeBodyFromHTML = require('getSafeBodyFromHTML');
const sanitizeDraftText = require('sanitizeDraftText');

const { List, Repeat } = Immutable;

const DraftPasteProcessor = {
  processHTML(
    html: string,
    blockRenderMap?: DraftBlockRenderMap,
    allowedStyles: List<string>,
    allowImages: boolean,
    allowLinks: boolean
  ): ?{ contentBlocks: ?Array<ContentBlock>, entityMap: EntityMap } {
    return convertFromHTMLtoContentBlocks(
      html,
      getSafeBodyFromHTML,
      blockRenderMap,
      allowedStyles,
      allowImages,
      allowLinks
    );
  },

  processText(
    textBlocks: Array<string>,
    character: CharacterMetadata,
    type: DraftBlockType
  ): Array<ContentBlock> {
    return textBlocks.map(textLine => {
      textLine = sanitizeDraftText(textLine);
      return new ContentBlock({
        key: generateRandomKey(),
        type,
        text: textLine,
        characterList: List(Repeat(character, textLine.length))
      });
    });
  }
};

module.exports = DraftPasteProcessor;
