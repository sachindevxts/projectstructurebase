import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { integrations } from '../../data/leadRouteDemoData';
import sharedStyles from '../../LeadRouteApp.module.scss';
import screenStyles from './SettingsScreen.module.scss';
const styles = { ...sharedStyles, ...screenStyles };
import { PageHeader, Tag, cx } from '../LeadRouteScreenShared';

const integrationFilters = ['All', 'Connected', 'Lead Sources', 'Enrichment', 'CRM', 'AI Providers'];

export function SettingsScreen() {
  const [filter, setFilter] = useState('All');
  const visible =
    filter === 'All'
      ? integrations
      : integrations.filter(
          (integration) =>
            (filter === 'Connected' && integration.connected) ||
            integration.category === filter.toUpperCase(),
        );

  return (
    <main className={styles.content}>
      <PageHeader
        title="Integrations & Settings"
        subtitle="Browse the integration directory below. Click any tile to connect - credentials are stored per user."
      />
      <TextField
        fullWidth
        size="small"
        placeholder="Search integrations... (e.g. Clay, Apollo, HubSpot)"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={15} />
            </InputAdornment>
          ),
        }}
      />
      <Box className={styles.buttonRow} my={2}>
        {integrationFilters.map((chip) => (
          <Button
            key={chip}
            variant={filter === chip ? 'contained' : 'outlined'}
            onClick={() => setFilter(chip)}
          >
            {chip}
            {chip === 'Connected' ? ' 1' : chip === 'All' ? ' 8' : ''}
          </Button>
        ))}
      </Box>
      {filter === 'AI Providers' && <AiProviders />}
      <Box className={cx(styles.grid, styles.grid3)} mt={2}>
        {visible.map((integration) => {
          const Icon = integration.icon;

          return (
            <Box className={cx(styles.panel, styles.integrationCard)} key={integration.name}>
              <Box className={styles.popular}>
                <Tag>{integration.connected ? 'Connected' : 'Popular'}</Tag>
              </Box>
              <Box className={styles.iconTile} sx={{ background: integration.background }}>
                <Icon size={17} />
              </Box>
              <Typography fontWeight={800} mt={2}>
                {integration.name}
              </Typography>
              <Typography color="text.secondary" fontSize={12}>
                {integration.description}
              </Typography>
              <Typography color="text.secondary" fontSize={10} mt={2}>
                {integration.category}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box className={cx(styles.panel, styles.panelPad)} mt={4}>
        <Typography fontSize={18} fontWeight={800}>
          Positioning Context
        </Typography>
        <Typography color="text.secondary" fontSize={12}>
          Injected into every AI generation as your company's mandate. The POSITIONING CONTEXT block
          is auto-generated from your company website and lives above the WRITING STYLE block.
        </Typography>
        <Box className={styles.bodyPreview} mt={2}>
          <Typography fontWeight={800} fontSize={12}>
            Auto-generate positioning context
          </Typography>
          <Typography color="text.secondary" fontSize={12}>
            Scrapes your homepage and asks AI to distill what you do, your ICP, the problems you
            solve, and the mandate for outbound copy.
          </Typography>
          <Box display="flex" gap={1} mt={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Leave blank to use company website on file"
            />
            <Button variant="contained" startIcon={<Sparkles size={16} />}>
              Generate from website
            </Button>
          </Box>
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={10}
          sx={{ mt: 2 }}
          defaultValue={`WRITING STYLE (STRICT - emails must read as written by a real human, never as AI):
- Sound conversational, slightly imperfect, and direct. Short sentences. Contractions (I'm, we've, don't).
- Do NOT use em dashes or en dashes ANYWHERE. Use a comma, period, or a plain hyphen with spaces instead.
- Avoid AI tells: 'delve', 'leverage', 'unlock', 'in today's fast-paced', 'I hope this email finds you well', 'seamlessly'.
- No marketing fluff, no triple adjectives, no bullet lists unless asked. No emojis.
- Keep it under 90 words. One clear ask. Sign off naturally - the mailbox signature is appended automatically.`}
        />
        <Box textAlign="right" mt={2}>
          <Button variant="contained">Save context</Button>
        </Box>
      </Box>
    </main>
  );
}

function AiProviders() {
  const providers = ['OpenAI', 'Anthropic', 'Google Gemini', 'Azure OpenAI', 'Mistral', 'Cohere'];

  return (
    <Box className={cx(styles.panel, styles.panelPad)} mb={3}>
      <Box className={styles.buttonRow}>
        <Sparkles color="#4285f4" size={18} />
        <Typography fontWeight={800}>AI Providers</Typography>
        <Tag>Choose one as default</Tag>
        <Tag>Default: openai</Tag>
      </Box>
      <Typography color="text.secondary" fontSize={12} mt={1}>
        Connect any number of AI providers. Each teammate brings their own keys; pick a default
        below and override it per campaign or per draft.
      </Typography>
      <Box className={cx(styles.grid, styles.grid2)} mt={2}>
        {providers.map((provider) => (
          <Box className={cx(styles.panel, styles.panelPad)} key={provider}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography fontWeight={800}>{provider}</Typography>
                <Typography color="text.secondary" fontSize={12}>
                  {provider === 'Cohere'
                    ? 'Command R+, Rerank'
                    : 'Each teammate connects their own account. Credentials are stored per user.'}
                </Typography>
              </Box>
              <Tag tone={provider === 'Cohere' ? 'green' : 'default'}>
                {provider === 'Cohere' ? 'Connected' : 'Not connected'}
              </Tag>
            </Box>
            <Button variant="contained" size="small" sx={{ mt: 2 }}>
              Connect {provider}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

