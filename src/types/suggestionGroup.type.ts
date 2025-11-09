/**
 * Represents a suggestion group entity displayed in the UI.
 *
 * @interface SuggestionGroup
 * @property {number} id - Unique identifier for the group.
 * @property {string} groupName - The name of the suggested group.
 * @property {number} members - The total number of members currently in the group.
 * @property {boolean} isFollowed - Indicates whether the user is already following this group.
 */


export interface SuggestionGroup {
  id: number
  groupName: string
  members: number
  isFollowed: boolean
}
