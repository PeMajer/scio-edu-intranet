import { course } from './schemas/course';
import { lecturer } from './schemas/lecturer';
import { sectionPage } from './schemas/sectionPage';
import { blockContent } from './schemas/blockContent';
import { highlightContent } from './schemas/highlightContent';
import { tag } from './schemas/tag';

export const schemaTypes = [tag, course, lecturer, sectionPage, blockContent, highlightContent];
