export const data = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'asdfasdf',
        },
      ],
    },
    {
      type: 'table',
      content: [
        {
          type: 'table_row',
          content: [
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'dfasdf',
                    },
                  ],
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'asdf',
                    },
                  ],
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                },
              ],
            },
          ],
        },
        {
          type: 'table_row',
          content: [
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const data2 = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 1,
        indent: 0,
        align: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'H1 Heading',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 2,
        indent: 0,
        align: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'H2 heading',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 3,
        indent: 0,
        align: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'H3 Heading',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 4,
        indent: 0,
        align: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'H4 Heading',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 5,
        indent: 0,
        align: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'H5 Heading',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 6,
        indent: 0,
        align: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'H6 Heading',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: 'Normal Text',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'strong',
            },
          ],
          text: 'Bold',
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'em',
            },
          ],
          text: 'Italic',
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'strikethrough',
            },
          ],
          text: 'Strikethough',
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'code',
            },
          ],
          text: 'Code',
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'strong',
            },
            {
              type: 'code',
            },
            {
              type: 'strikethrough',
            },
          ],
          text: 'Combined',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: 'Text Align Left',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'center',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: 'Text Align Center',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'right',
        indent: 0,
      },
      content: [
        {
          type: 'text',
          text: 'Text Align Right',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
    },
    {
      type: 'ordered_list',
      content: [
        {
          type: 'list_item',
          attrs: {
            indent: 1,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: 'Ordered List',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          attrs: {
            indent: 2,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: 'Ordered List',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          attrs: {
            indent: 2,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: 'Ordered List',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          attrs: {
            indent: 3,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: 'Ordered List',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          attrs: {
            indent: 3,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: 'Ordered List',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
    },
    {
      type: 'bullet_list',
      content: [
        {
          type: 'list_item',
          attrs: {
            indent: 1,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: 'Unordered List',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          attrs: {
            indent: 2,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: '0',
              },
              content: [
                {
                  type: 'text',
                  text: 'Unordered List',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          attrs: {
            indent: 3,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: '0',
              },
              content: [
                {
                  type: 'text',
                  text: 'Unordered List',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          attrs: {
            indent: 2,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                align: 'left',
                indent: 0,
              },
              content: [
                {
                  type: 'text',
                  text: 'Unordered List',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
    },
    {
      type: 'paragraph',
      attrs: {
        align: 'left',
        indent: 0,
      },
    },
  ],
};
